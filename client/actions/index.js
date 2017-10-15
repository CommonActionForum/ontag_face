import { CALL_API } from '../middlewares/call-api'
import { ADD_ANNOTATION_COLOR } from '../middlewares/add-annotation-color'

export const CREATE_ANNOTATION = 'CREATE_ANNOTATION'
export const CREATE_ANNOTATION_SUCCESS = 'CREATE_ANNOTATION_SUCCESS'
export const CREATE_ANNOTATION_PENDING = 'CREATE_ANNOTATION_PENDING'
export const CREATE_ANNOTATION_FAILURE = 'CREATE_ANNOTATION_FAILURE'

export const DELETE_ANNOTATION = 'DELETE_ANNOTATION'
export const DELETE_ANNOTATION_SUCCESS = 'DELETE_ANNOTATION_SUCCESS'
export const DELETE_ANNOTATION_PENDING = 'DELETE_ANNOTATION_PENDING'
export const DELETE_ANNOTATION_FAILURE = 'DELETE_ANNOTATION_FAILURE'

export const ADD_ANSWER_ANNOTATION = 'ADD_ANSWER_ANNOTATION'
export const ADD_ANSWER_ANNOTATION_SUCCESS = 'ADD_ANSWER_ANNOTATION_SUCCESS'
export const ADD_ANSWER_ANNOTATION_PENDING = 'ADD_ANSWER_ANNOTATION_PENDING'
export const ADD_ANSWER_ANNOTATION_FAILURE = 'ADD_ANSWER_ANNOTATION_FAILURE'

export const REMOVE_ANSWER_ANNOTATION = 'REMOVE_ANSWER_ANNOTATION'
export const REMOVE_ANSWER_ANNOTATION_SUCCESS = 'REMOVE_ANSWER_ANNOTATION_SUCCESS'
export const REMOVE_ANSWER_ANNOTATION_PENDING = 'REMOVE_ANSWER_ANNOTATION_PENDING'
export const REMOVE_ANSWER_ANNOTATION_FAILURE = 'REMOVE_ANSWER_ANNOTATION_FAILURE'

export const CREATE_ANSWER = 'CREATE_ANSWER'
export const CREATE_ANSWER_SUCCESS = 'CREATE_ANSWER_SUCCESS'
export const CREATE_ANSWER_PENDING = 'CREATE_ANSWER_PENDING'
export const CREATE_ANSWER_FAILURE = 'CREATE_ANSWER_FAILURE'

export const EDIT_LIQEN = 'EDIT_LIQEN'
export const EDIT_LIQEN_SUCCESS = 'EDIT_LIQEN_SUCCESS'
export const EDIT_LIQEN_PENDING = 'EDIT_LIQEN_PENDING'
export const EDIT_LIQEN_FAILURE = 'EDIT_LIQEN_FAILURE'

export const CHANGE_LIQEN_COLOR = 'CHANGE_LIQEN_COLOR'

let nextAnnotationCid = 0
// target = { prefix, suffix, exact }
// tag = integer (tag ID)
export function createAnnotation (target, tag) {
  const cid = `c-${nextAnnotationCid}`
  nextAnnotationCid++

  return {
    [CALL_API]: {
      type: CREATE_ANNOTATION,
      remotePayload (store) {
        return {
          entry_id: store.getState().entry.id,
          tag_id: store.getState().tags[tag].id,
          target
        }
      },
      localPayload (store) {
        return {
          entry_id: store.getState().entry.id,
          tag_id: store.getState().tags[tag].id,
          target
        }
      },
      actions: [
        CREATE_ANNOTATION_PENDING,
        CREATE_ANNOTATION_SUCCESS,
        CREATE_ANNOTATION_FAILURE
      ],
      key: 'annotation',
      cid
    }
  }
}

export function deleteAnnotation (annotationCid) {
  return {
    [CALL_API]: {
      type: DELETE_ANNOTATION,
      remotePayload () {
        return annotationCid
      },
      localPayload () {
        return {}
      },
      actions: [
        DELETE_ANNOTATION_PENDING,
        DELETE_ANNOTATION_SUCCESS,
        DELETE_ANNOTATION_FAILURE
      ],
      key: 'annotation',
      cid: annotationCid
    }
  }
}

export function addAnnotationColor (color, annotationCid, colors) {
  return {
    [ADD_ANNOTATION_COLOR]: {
      color,
      annotationCid,
      colors
    }
  }
}

export function removeAnswerAnnotation (color, annotationCid, colors) {
  function objectToArray (object) {
    const ret = []
    for (let i in object) {
      ret.push(Object.assign({}, object[i], {cid: i}))
    }

    return ret
  }

  function coloredAnswers (store) {
    return objectToArray(store.getState().answers)
      .map((ans, i) => ({
        id: ans.id,
        annotations: ans.annotations,
        cid: ans.cid,
        color: i < colors.length ? colors[i] : null
      }))
  }

  return {
    [CALL_API]: {
      type: REMOVE_ANSWER_ANNOTATION,
      remotePayload (store) {
        return {
          annotation_id: store.getState().annotations[annotationCid].id,
          answer_id: coloredAnswers(store)
            .filter(ans => ans.color === color)[0].id
        }
      },
      localPayload (store) {
        return {
          annotation_cid: annotationCid,
          answer_cid: coloredAnswers(store)
            .filter(ans => ans.color === color)[0].cid
        }
      },
      actions: [
        REMOVE_ANSWER_ANNOTATION_PENDING,
        REMOVE_ANSWER_ANNOTATION_SUCCESS,
        REMOVE_ANSWER_ANNOTATION_FAILURE
      ],
      key: 'answer_annotation'
    }
  }
}
