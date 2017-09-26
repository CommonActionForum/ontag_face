import cookies from 'cookies-js'
import realCore from '../server/ontag-fake-core/index'
import fakeCore from '../server/ontag-fake-core/index'

const token = cookies.get('access_token')

let core

if (process.env.ONTAG_FAKE_CORE === 'true') {
  core = fakeCore(token)
}

if (process.env.ONTAG_FAKE_CORE === 'false') {
  core = realCore(token)
}

console.log(core)

export default core
