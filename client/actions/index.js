import { CALL_API } from '../middlewares/call-api'
import { CHANGE_ANNOTATION_COLOUR } from '../middlewares/change-annotation-colour'

export const CREATE_ANNOTATION = 'CREATE_ANNOTATION'
export const CREATE_ANNOTATION_SUCCESS = 'CREATE_ANNOTATION_SUCCESS'
export const CREATE_ANNOTATION_PENDING = 'CREATE_ANNOTATION_PENDING'
export const CREATE_ANNOTATION_FAILURE = 'CREATE_ANNOTATION_FAILURE'

export const CREATE_LIQEN = 'CREATE_LIQEN'
export const CREATE_LIQEN_SUCCESS = 'CREATE_LIQEN_SUCCESS'
export const CREATE_LIQEN_PENDING = 'CREATE_LIQEN_PENDING'
export const CREATE_LIQEN_FAILURE = 'CREATE_LIQEN_FAILURE'

export const EDIT_LIQEN = 'EDIT_LIQEN'
export const EDIT_LIQEN_SUCCESS = 'EDIT_LIQEN_SUCCESS'
export const EDIT_LIQEN_PENDING = 'EDIT_LIQEN_PENDING'
export const EDIT_LIQEN_FAILURE = 'EDIT_LIQEN_FAILURE'

export const CHANGE_LIQEN_COLOUR = 'CHANGE_LIQEN_COLOUR'

let nextAnnotationRef = 0
// target = { prefix, suffix, exact }
// tag = integer (tag ID)
export function createAnnotation (target, tag) {
  const ref = `c-${nextAnnotationRef}`
  nextAnnotationRef++

  return {
    [CALL_API]: {
      type: CREATE_ANNOTATION,
      actions: [
        CREATE_ANNOTATION_PENDING,
        CREATE_ANNOTATION_SUCCESS,
        CREATE_ANNOTATION_FAILURE
      ],
      annotation: {
        target,
        tag
      },
      ref
    }
  }
}

let nextLiqenRef = 0
// answer = array of strings (annotation ref)
export function createLiqen (answer) {
  const ref = `c-${nextLiqenRef}`
  nextLiqenRef++

  return {
    [CALL_API]: {
      type: CREATE_LIQEN,
      actions: [
        CREATE_LIQEN_PENDING,
        CREATE_LIQEN_SUCCESS,
        CREATE_LIQEN_FAILURE
      ],
      liqen: {
        answer
      },
      ref
    }
  }
}

// annotation = string (ref)
// colour = string
export function addAnnotationColour (annotation, colour) {
  return {
    [CHANGE_ANNOTATION_COLOUR]: {
      operation: 'add',
      annotation,
      colour
    }
  }
}

export function removeAnnotationColour (annotation, colour) {
  return {
    [CHANGE_ANNOTATION_COLOUR]: {
      operation: 'remove',
      annotation,
      colour
    }
  }
}

// liqen = string (ref)
// colour = string
export function changeLiqenColour (liqen, colour) {
  return {
    type: CHANGE_LIQEN_COLOUR,
    liqen,
    colour
  }
}

// annotation = string (ref)
// answer = array of annotation refs
export function editLiqen (liqen, answer) {
  return {
    [CALL_API]: {
      type: EDIT_LIQEN,
      ref: liqen,
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
