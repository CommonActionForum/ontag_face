import Cookies from 'cookies'

export default function checkSession (req, res, next) {
  const cookies = new Cookies(req, res)
  const userId = cookies.get('user_id')

  if (!userId) {
    return res.redirect('/login')
  }

  console.log('Calling core.users.show')
  return req
    .core.users.show(userId)
    .then(user => {
      console.log('Call success. Showing user: ', user)
      req.currentUser = user
      next()
    })
    .catch((e) => {
      console.log('Call failed. Showing error: ', e)
      res.redirect('/login')
    })
}
