export default async function annotate (req, res, next) {
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

  async function getArticle () {
    try {
      const article = await req.core.articles.show(articleId)

      return article
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
}
