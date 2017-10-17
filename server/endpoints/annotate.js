function arrayToObject (array) {
  const ret = {}
  array.forEach(e => { ret[e.id] = e })
  return ret
}

export default async function annotate (req, res) {
  if (!req.query.entry || !req.query.question) {
    console.log('ENDPOINT annotate > Missing query params `entry` or `question`')
    return res.redirect('/')
  }

  const entryId = req.query.entry
  const questionId = req.query.question

  console.log('ENDPOINT annotate > Calling core.entries.show()')
  const p1 = req
    .core.entries.show(entryId)

  console.log('ENDPOINT annotate > Calling core.questions.show()')
  const p2 = req
    .core.questions.show(questionId)

  console.log('ENDPOINT annotate > Calling core.annotations.index()')
  const p3 = req
    .core.annotations.index()

  console.log('ENDPOINT annotate > Calling core.answers.index()')
  const p4 = req
    .core.answers.index()

  Promise.all([p1, p2, p3, p4])
    .then(values => {
      const [entry, question, annotations, answers] = values

      const reduxQuestion = {
        id: question.id.toString(),
        title: question.title,
        required_tags: question.required_tags.map(t => t.id.toString()),
        optional_tags: question.optional_tags.map(t => t.id.toString())
      }

      const reduxTags = question
        .required_tags.concat(question.optional_tags)
        .map(t => ({
          id: t.id.toString(),
          title: t.title
        }))

      const reduxAnswers = answers.map(a => ({
        id: a.id.toString(),
        question_id: a.question_id,
        annotations: a.annotations.map(a => a.id.toString())
      }))

      const reduxState = {
        question: reduxQuestion,
        tags: arrayToObject(reduxTags),
        annotations: arrayToObject(annotations),
        answers: arrayToObject(reduxAnswers),
        entry
      }

      res.render('annotate', {entry, question, state: reduxState})
    })
    .catch(e => {
      console.log('ENDPOINT annotate > Failed some request to the core')
      res.send('failed')
    })
}
