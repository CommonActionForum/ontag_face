import Cookies from 'cookies'

export default function checkSession (req, res, next) {
  console.log('MW checkSession > start')

  const cookies = new Cookies(req, res)
  const token = cookies.get('access_token')

  if (!token) {
    console.log('MW checkSession > no `access_token` in cookies present. Redirecting to /login')
    return res.redirect('/login')
  }

  console.log('MW checkSession: call core.users.show')

  return req
    .core.me.show(token)
    .then(user => {
      console.log('MW checkSession > call successful.')
      console.log('MW checkSession > Setting `req.currentUser` to the right variable')
      console.log('MW checkSession > next()')

      req.currentUser = user
      next()
    })
    .catch((e) => {
      console.log('MW checkSession > call not successful. Showing error')
      console.log(e)
      console.log('MW checkSession > redirecting to /login')
      res.redirect('/login')
    })
}
