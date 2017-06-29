import Cookies from 'cookies'

export default function login (req, res, next) {
  if (!req.body) {
    return res.render('index')
  }

  const cookies = new Cookies(req, res)

  return req
    .core.sessions.create({
      email: req.body.email,
      password: req.body.password
    })
    .then(session => {
      cookies
        .set('access_token', session.access_token, {httpOnly: false})
        .set('user_id', session.user.id, {httpOnly: false})

      req.user = session.user
      next()
    })
    .catch((e) => {
      res.render('index')
    })
}
