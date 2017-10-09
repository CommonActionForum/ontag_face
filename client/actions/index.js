import { CALL_API } from '../middlewares/call-api'
import { CHANGE_ANNOTATION_COLOR } from '../middlewares/change-annotation-color'

export const CREATE_ANNOTATION = 'CREATE_ANNOTATION'
export const CREATE_ANNOTATION_SUCCESS = 'CREATE_ANNOTATION_SUCCESS'
export const CREATE_ANNOTATION_PENDING = 'CREATE_ANNOTATION_PENDING'
export const CREATE_ANNOTATION_FAILURE = 'CREATE_ANNOTATION_FAILURE'

export const ADD_ANSWER_ANNOTATION = 'ADD_ANSWER_ANNOTATION'
export const ADD_ANSWER_ANNOTATION_SUCCESS = 'ADD_ANSWER_ANNOTATION_SUCCESS'
export const ADD_ANSWER_ANNOTATION_PENDING = 'ADD_ANSWER_ANNOTATION_PENDING'
export const ADD_ANSWER_ANNOTATION_FAILURE = 'ADD_ANSWER_ANNOTATION_FAILURE'

export const REMOVE_ANSWER_ANNOTATION = 'REMOVE_ANSWER_ANNOTATION'
export const REMOVE_ANSWER_ANNOTATION_SUCCESS = 'REMOVE_ANSWER_ANNOTATION_SUCCESS'
export const REMOVE_ANSWER_ANNOTATION_PENDING = 'REMOVE_ANSWER_ANNOTATION_PENDING'
export const REMOVE_ANSWER_ANNOTATION_FAILURE = 'REMOVE_ANSWER_ANNOTATION_FAILURE'

export const CREATE_LIQEN = 'CREATE_LIQEN'
export const CREATE_LIQEN_SUCCESS = 'CREATE_LIQEN_SUCCESS'
export const CREATE_LIQEN_PENDING = 'CREATE_LIQEN_PENDING'
export const CREATE_LIQEN_FAILURE = 'CREATE_LIQEN_FAILURE'

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

// answer = string (cid)
// annotation = string (cid)
export function addAnswerAnnotation (color, annotationCid, colors) {
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
      type: ADD_ANSWER_ANNOTATION,
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
        ADD_ANSWER_ANNOTATION_PENDING,
        ADD_ANSWER_ANNOTATION_SUCCESS,
        ADD_ANSWER_ANNOTATION_FAILURE
      ],
      key: 'answer_annotation'
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

export function removeAnnotationColor (annotation, color) {
  return {
    [CHANGE_ANNOTATION_COLOR]: {
      operation: 'remove',
      annotation,
      color
    }
  }
}

// liqen = string (cid)
// color = string
export function changeLiqenColor (liqen, color) {
  return {
    type: CHANGE_LIQEN_COLOR,
    liqen,
    color
  }
}

// annotation = string (cid)
// answer = array of annotation cids
export function editLiqen (liqen, answer) {
  return {
    [CALL_API]: {
      type: EDIT_LIQEN,
      cid: liqen,
      actions: [
        EDIT_LIQEN_PENDING,
        EDIT_LIQEN_SUCCESS,
        EDIT_LIQEN_FAILURE
      ],
      liqen: {
        answer
      }
    }
  }
}
