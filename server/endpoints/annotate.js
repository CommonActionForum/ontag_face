export default async function annotate (req, res) {
  if (!req.query.article || !req.query.question) {
    return res.redirect('/')
  }

  const articleId = req.query.article
  const questionId = req.query.question

  // Declare 4 functions that return promises
  // Then call Promise.all() to paralelize the 4 functions

  async function getQuestionAndTags () {
    try {
      const question = await req.core.questions.show(questionId)
      const tags = await Promise.all(question.answer.map(async (answer) => {
        const tag = await req.core.tags.show(answer.tag)
        return tag
      }))

      const tags2 = {}
      for (let tag of tags) {
        tags2[tag.id] = {
          id: tag.id.toString(),
          title: tag.title
        }
      }

      return {
        question: {
          id: question.id.toString(),
          title: question.title,
          answer: question.answer.map(a => ({
            tag: a.tag.toString(),
            required: a.required
          }))
        },
        tags: tags2
      }
    } catch (e) {
      console.log('error 1')
      console.log(e)
    }
  }

  async function getArticle () {
    try {
      const article = await req.core.articles.show(articleId)

      return {
        title: article.title,
        source: article.source,
        id: article.id.toString()
      }
    } catch (e) {
      console.log('error 2')
      console.log(e)
    }
  }

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
            id: annotation.id.toString(),
            tag: annotation.tags[0].id.toString(),
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

  async function getColoredLiqens () {
    try {
      const list = await req.core.liqens.index({question_id: questionId})

      const liqens = await Promise.all(list.map(async ({question_id, id}) => {
        const liqen = await req.core.liqens.show(id)
        return liqen
      }))

      const liqens2 = {}
      const coloursList = [
        '#FFAB40',
        '#E91E63',
        '#E040FB',
        '#AA00FF',
        '#9FA8DA',
        '#2962FF',
        '#18FFFF',
        '#B2FF59',
        '#EEFF41',
        '#FFFFFF'
      ]
      const colours = {}

      let i = 0
      for (let liqen of liqens) {
        liqens2[liqen.id] = {
          answer: liqen.annotations.map(a => a.id.toString()),
          pending: false
        }
        if (i < 10) {
          colours[coloursList[i]] = liqen.id.toString()
          i++
        }
      }

      for (; i < 10; i++) {
        colours[coloursList[i]] = null
      }

      return {
        colours,
        liqens: liqens2
      }
    } catch (e) {
      console.log('error 4')
      console.log(e)
    }
  }

  // Paralelize
  try {
    const [{question, tags}, article, annotations, {liqens, colours}] = await Promise.all([
      getQuestionAndTags(),
      getArticle(),
      getAnnotations(),
      getColoredLiqens()
    ])

    const state = {
      question,
      article,
      tags,
      annotations,
      liqens,
      colours
    }

    return res.render('annotate', {article, state})
  } catch (e) {
    console.log('error 3')
    console.log(e)
  }
}
