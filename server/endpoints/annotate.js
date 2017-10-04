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

  Promise.all([p1, p2])
    .then(values => {
      const [entry, question] = values

      res.render('annotate', {entry, question})
    })
    .catch(e => {
      console.log('ENDPOINT annotate > Failed some request to the core')
      res.send('failed')
    })
}
