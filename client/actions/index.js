import { CALL_API } from '../middlewares/call-api'

export const CREATE_ANNOTATION = 'CREATE_ANNOTATION'
export const CREATE_ANNOTATION_SUCCESS = 'CREATE_ANNOTATION_SUCCESS'
export const CREATE_ANNOTATION_PENDING = 'CREATE_ANNOTATION_PENDING'
export const CREATE_ANNOTATION_FAILURE = 'CREATE_ANNOTATION_FAILURE'

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
