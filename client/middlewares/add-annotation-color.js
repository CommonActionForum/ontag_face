import { CREATE_ANSWER,
         CREATE_ANSWER_PENDING,
         CREATE_ANSWER_SUCCESS,
         CREATE_ANSWER_FAILURE,
         ADD_ANSWER_ANNOTATION,
         ADD_ANSWER_ANNOTATION_PENDING,
         ADD_ANSWER_ANNOTATION_SUCCESS,
         ADD_ANSWER_ANNOTATION_FAILURE } from '../actions'
import { CALL_API } from './call-api'

export const ADD_ANNOTATION_COLOR = Symbol('add annotation color')

export default store => next => action => {
  const payload = action[ADD_ANNOTATION_COLOR]

  if (typeof payload === 'undefined') {
    return next(action)
  }

  // Middleware starts here
  const { color, annotationCid, colors } = payload

  function objectToArray (object) {
    const ret = []
    for (let i in object) {
      ret.push(Object.assign({}, object[i], {cid: i}))
    }

    return ret
  }

  const coloredAnswers = objectToArray(store.getState().answers)
    .map((ans, i) => ({
      id: ans.id,
      annotations: ans.annotations,
      cid: ans.cid,
      color: i < colors.length ? colors[i] : null
    }))
    .filter(ans => ans.color === color)

  if (coloredAnswers.length === 0) {
    next(createAnswer(annotationCid))
  } else {
    const answer = coloredAnswers[0]
    next(addAnswerAnnotation(answer, annotationCid))
  }
}

let nextAnswerCid = 0

function addAnswerAnnotation (answer, annotationCid) {
  return {
    [CALL_API]: {
      type: ADD_ANSWER_ANNOTATION,
      remotePayload (store) {
        return {
          annotation_id: store.getState().annotations[annotationCid].id,
          answer_id: answer.id
        }
      },
      localPayload (store) {
        return {
          annotation_cid: annotationCid,
          answer_cid: answer.cid
        }
      },
      actions: [
        ADD_ANSWER_ANNOTATION_PENDING,
        ADD_ANSWER_ANNOTATION_SUCCESS,
        ADD_ANSWER_ANNOTATION_FAILURE
      ],
      key: 'answer_annotation'
    }
  }
}

function createAnswer (annotationCid) {
  const cid = `c-${nextAnswerCid}`
  nextAnswerCid++

  return {
    [CALL_API]: {
      type: CREATE_ANSWER,
      remotePayload (store) {
        return {
          question_id: store.getState().question.id,
          annotations: [store.getState().annotations[annotationCid].id]
        }
      },
      localPayload (store) {
        return {
          question_id: store.getState().question.id,
          annotations: [annotationCid]
        }
      },
      actions: [
        CREATE_ANSWER_PENDING,
        CREATE_ANSWER_SUCCESS,
        CREATE_ANSWER_FAILURE
      ],
      key: 'answer',
      cid
    }
  }
}
