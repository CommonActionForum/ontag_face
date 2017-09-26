export default function callbackFromMedium (req, res) {
  if (!req.query.code || !req.query.state) {
    console.log('ENDPOINT callbackFromMedium. Missing query params `code` and `state`')
    return res.redirect('/')
  }

  const code = req.query.code
  const state = req.query.state

  console.log('ENDPOINT callbackFromMedium. Calling core.me.medium.create()')
  req
    .core.me.medium.create({code, state})
    .then((user) => {
      res.render('import-from-medium-step2', {user})
    })
}
