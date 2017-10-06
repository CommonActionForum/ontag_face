import ontagCore from '../../server/ontag-core/index'
import fakeOntagCore from '../../server/ontag-fake-core/index'
import cookies from 'cookies-js'
import * as ActionType from '../actions'

export const CALL_API = Symbol('call api')

function getFunctionCall (type) {
  const token = cookies.get('access_token')
  const options = {
    apiURI: process.env.ONTAG_API_URI
  }
  const core = process.env.ONTAG_FAKE_CORE === 'true'
             ? fakeOntagCore(token, options)
             : ontagCore(token, options)

  switch (type) {
    case ActionType.CREATE_ANNOTATION:
      return core.annotations.create
    case ActionType.ADD_ANSWER_ANNOTATION:
      return ({annotation_id, answer_id}) =>
        core.answers.add_annotation(answer_id, {annotation_id})
  }
}

export default store => next => action => {
  const callAPI = action[CALL_API]

  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  console.log('MW call api >', callAPI.type)

  // Middleware starts here
  const { cid, type, actions, remotePayload, localPayload, key } = callAPI
  const fn = getFunctionCall(type)

  next({
    type: actions[0],
    [key]: localPayload(store),
    cid
  })

  return fn(remotePayload(store))
    .then(obj => next({
      type: actions[1],
      [key]: obj,
      cid
    }))
    .catch(err => next({
      type: actions[2],
      error: err,
      cid
    }))
}
