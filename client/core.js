import cookies from 'cookies-js'
import realCore from '../server/ontag-core/index'
import fakeCore from '../server/ontag-fake-core/index'

const token = cookies.get('access_token') || ''
const options = {
  apiURI: process.env.ONTAG_API_URI || 'http://localhost:4000'
}

let core

if (process.env.ONTAG_FAKE_CORE === 'true') {
  core = fakeCore(token, options)
}

if (process.env.ONTAG_FAKE_CORE === 'false') {
  core = realCore(token, options)
}

export default core
