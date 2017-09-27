import Cookies from 'cookies'

export default function setLiqenCore (core) {
  return function (req, res, next) {
    const cookies = new Cookies(req, res)
    const accessToken = cookies.get('access_token')
    const options = {
      apiURI: process.env.LIQEN_API_URI || 'http://localhost:4000'
    }

    if (accessToken) {
      req.core = core(accessToken, options)
    } else {
      req.core = core('', options)
    }
    next()
  }
}
