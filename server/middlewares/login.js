import Cookies from 'cookies'

export default function login (req, res, next) {
  console.log('MW login > start')
  if (!req.body) {
    console.log('MW login > no `req.body` available. Rendering index')
    return res.render('index')
  }

  const cookies = new Cookies(req, res)

  return req
    .core.sessions.create({
      email: req.body.email,
      password: req.body.password
    })
    .then(({ access_token }) => {
      console.log('MW login > login successful. Setting `access_token` cookie')
      console.log('MW login > next()')

      cookies.set('access_token', access_token, {httpOnly: false})

      next()
    })
    .catch((e) => {
      console.log('MW login > login not successful. Showing detailed errors')
      console.log(e)
      console.log('MW login > rendering index')
      res.render('index')
    })
}
