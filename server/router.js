/**
 * Router for "non-dashboard" pages
 */
import express from 'express'
import bodyParser from 'body-parser'
import { checkSession, login } from './middlewares'
import { downloadArticle } from 'liqen-scrapper'

const router = express.Router()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', checkSession, (req, res, next) => {
  console.log('Calling core.questions.show')
  req.core.questions.show(1)
    .then(question => {
      res.render('dashboard', {question})
    })
    .catch(e => {
      console.log('Call failed. Showing error ', e)
      res.redirect('/login')
    })
})

router.get('/parseArticle', (req, res, next) => {
  if (!req.query.uri) {
    return res.send({})
  }

  if (process.env.NODE_ENV === 'development') {
    res.send({
      body: {
        object: {
          name: 'div',
          attrs: {},
          children: [
            {
              name: 'p',
              attrs: {},
              children: [
                'Mientras la anémica creación de empleo sigue siendo el Talón de Aquiles de la ',
                {
                  name: 'a',
                  attrs: {
                    'href': 'http://www.bancomundial.org/es/region/lac/overview'
                  },
                  children: [
                    'recuperación económica en EE.UU y Europa'
                  ]
                },
                ', muchos profesionales latinoamericanos ven mejores oportunidades en esas tierras, en un éxodo que ha visto emigraciones de hasta 90% en algunos países del Caribe.'
              ]
            },
            {
              name: 'p',
              attrs: {},
              children: [
                'El colombiano Stefano Badalacchi es uno de ellos. Son las 7 AM de un húmedo día de otoño en París. Badalacchi, de 24 años, se ajusta la corbata al cuello mientras echa llave a la puerta de casa, acomoda en su hombro la bolsa con la ‘compu’, y se dirige hacia el metro que le llevará a su nuevo puesto de trabajo en Ivry Sur Senne, como analista económico en una organización no gubernamental.'
              ]
            },
            {
              name: 'p',
              attrs: {},
              children: [
                'Hace más de cinco años que se fue de Colombia, y afirma que no tiene intención de regresar, porque “aquí se te valora más como profesional”.'
              ]
            }
          ] // children
        } // object
      } // body
    })
  } else {
    return downloadArticle(req.query.uri)
      .then(article => res.send(article))
  }
})

router.get('/annotate', checkSession, async function (req, res, next) {
  if (!req.query.article || !req.query.question) {
    return res.redirect('/')
  }

  const articleId = req.query.article
  const questionId = req.query.question

  // Take the question and its tags
  async function getQuestionAndTags () {
    try {
      const question = await req.core.questions.show(questionId)
      const tags = await Promise.all(question.answer.map(async (answer) => {
        const tag = await req.core.tags.show(answer.tag)
        return tag
      }))

      const tags2 = {}
      for (let tag of tags) {
        tags2[tag.id] = tag
      }

      return {
        question,
        tags: tags2
      }
    } catch (e) {
      console.log('error 1')
      console.log(e)
    }
  }

  // Take the article and parse it
  async function getArticle () {
    try {
      const article = await req.core.articles.show(articleId)

      return article
    } catch (e) {
      console.log('error 2')
      console.log(e)
    }
  }

  // Take the annotations
  async function getAnnotations () {
    try {
      const list = await req.core.annotations.index({article_id: articleId})

      const annotations = await Promise.all(list.map(async ({id, author, article_id}) => {
        const annotation = await req.core.annotations.show(id)
        return annotation
      }))

      const annotations2 = {}

      for (let annotation of annotations) {
        if (annotation.tags.length > 0) {
          annotations2[annotation.id] = {
            tag: annotation.tags[0].id,
            target: {
              prefix: annotation.target.prefix,
              exact: annotation.target.exact,
              suffix: annotation.target.suffix
            },
            checked: false,
            pending: false
          }
        }
      }

      return annotations2
    } catch (e) {
      console.log('error 3')
      console.log(e)
    }
  }

  async function getLiqens () {
    try {
      const list = await req.core.liqens.index({question_id: questionId})

      const liqens = await Promise.all(list.map(async ({question_id, id}) => {
        const liqen = await req.core.liqens.show(id)
        return liqen
      }))

      const liqens2 = {}

      for (let liqen of liqens) {
        liqens2[liqen.id] = {
          answer: liqen.annotations.map(a => a.id),
          pending: false
        }
      }

      return liqens2
    } catch (e) {
      console.log('error 4')
      console.log(e)
    }
  }

  // Paralelize
  try {
    const [{question, tags}, article, annotations, liqens] = await Promise.all([
      getQuestionAndTags(),
      getArticle(),
      getAnnotations(),
      getLiqens()
    ])

    const state = {
      question,
      article,
      tags,
      annotations,
      liqens,
      newLiqen: {
        answer: question.answer.map(a => null)
      }
    }

    return res.render('annotate', {article, state})
  } catch (e) {
    console.log('error 3')
    console.log(e)
  }
})

router.get('/about', (req, res, next) => {
  res.render('about')
})

router.post('/login', urlencodedParser, login, (req, res) => {
  res.redirect('/')
})

router.get('/login', (req, res) => {
  res.render('index')
})

// Temporal backend.
//
// In a future, replace this with a GraphQL endpoint
router.get('/backend', (req, res) => {
  req
    .core.articles.index()
    .then(articles => res.json(articles))
    .catch(err => res.json(err))
})

router.get('*', (req, res, next) => {
  res.send('404 Not found')
})

export default router
