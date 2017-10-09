import url from 'url'
import resourceFactory from './resource-factory'
import { fetchJSON } from './resource-factory'

export default function answers (apiURI, headers) {
  const r = resourceFactory(apiURI, headers)

  return Object.assign({}, r('answers'), {
    add_annotation (id, params) {
      return fetchJSON(url.resolve(apiURI, '/v1/answers/' + id + '/add_annotation'), 'post', params, headers)
    },

    remove_annotation (id, params) {
      return fetchJSON(url.resolve(apiURI, '/v1/answers/' + id + '/remove_annotation'), 'post', params, headers)
    }
  })
}
