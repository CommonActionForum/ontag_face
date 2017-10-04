export default async function annotate (req, res) {
  if (!req.query.entry || !req.query.question) {
    console.log('ENDPOINT annotate > Missing query params `entry` or `question`')
    return res.redirect('/')
  }

  const entryId = req.query.entry
  const questionId = req.query.question

}
