import url from 'url'
import { APIError,
         AuthenticationError,
         ClientError,
         ConnectionError,
         InvalidRequestError,
         ErrorCodes as EC } from './errors'
import fetch from 'isomorphic-fetch'

// Performs the API call
export function fetchJSON (endpoint, method, body, headers) {
  return fetch(endpoint, { method, headers, body: JSON.stringify(body) })
    .catch(() => { throw new ConnectionError() })
    .then(parseJSON)
    .then(checkResponseErrors)
    .then(response => response.json)
}

// Throws some errors depending on the response
export function checkResponseErrors (response) {
  const body = response.json

  switch (response.status) {
    case 401:
    case 403:
      throw new AuthenticationError({
        status: response.status,
        message: body && body.message
      })
    case 422:
      throw new InvalidRequestError({
        message: body && body.message,
        errors: body && body.errors
      })
    case 404:
      throw new ClientError({
        status: response.status,
        message: body && body.message
      })
    default:
      return response
  }
}

// Parses the JSON
export function parseJSON (response) {
  return response
    .json()
    .then(json => Object.assign(response, {json}))
    .catch(() => {
      throw new APIError({
        code: EC.UNPROCESSABLE_JSON
      })
    })
}

const resourceFactory = (apiURI, headers) => name => ({
  index (params) {
    return fetchJSON(url.resolve(apiURI, '/v1/' + name), 'get', params, headers)
  },

  show (id) {
    return fetchJSON(url.resolve(apiURI, '/v1/' + name + '/' + id), 'get', {}, headers)
  },

  create (params) {
    return fetchJSON(url.resolve(apiURI, '/v1/' + name), 'post', params, headers)
  },

  update (id, params) {
    return fetchJSON(url.resolve(apiURI, '/v1/' + name + '/' + id), 'patch', params, headers)
  },

  delete (id) {
    return fetchJSON(url.resolve(apiURI, '/v1/' + name + '/' + id), 'delete', {}, headers)
  }
})

export default resourceFactory
