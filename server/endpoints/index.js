export default function index (req, res) {
  req
    .core.questions.show(1)
    .then(question => {
      res.render('dashboard', {question})
    })
    .catch(e => {
      res.redirect('/login')
    })
}
