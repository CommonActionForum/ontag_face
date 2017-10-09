import url from 'url'
import resourceFactory from './resource-factory'
import { fetchJSON } from './resource-factory'
import answers from './answers'

// Default options related to the API
const DEFAULT_OPTIONS = {
  apiURI: 'https://ontag-core.herokuapp.com'
}

function createClient (token, options = DEFAULT_OPTIONS) {
  // Set headers
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }

  const r = resourceFactory(options.apiURI, headers)

  return {
    annotations: r('annotations'),
    answers: answers(options.apiURI, headers),
    entries: r('entries'),
    questions: r('questions'),
    sessions: r('sessions'),
    tags: r('tags'),
    users: r('users'),
    me: Object.assign(r('me'), {
      add_medium_credential(params) {
        return fetchJSON(url.resolve(options.apiURI, '/v1/me/medium'), 'post', params, headers)
      }
    })
  }
}

export default createClient
export * from './errors'
