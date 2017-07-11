import * as ActionTypes from '../actions/index'

const initialState = {
  question: {
    id: 12,
    title: 'Title of the question',
    answer: [
      {
        tag: 't1',
        required: true
      }
    ]
  },
  article: {
    id: 100,
    title: 'Title of the article'
  },
  annotations: {
    a1: {
      id: 908,
      tag: 't1',
      target: {
        prefix: 'como ',
        exact: 'analista',
        suffix: ' económico en una organización no gubernamental.'
      },
      checked: false,
      pending: false
    }
  },
  liqens: {
    'l1': {
      id: 9,
      annotations: ['a1']
    }
  },
  tags: {
    't1': {
      id: 1209,
      title: 'tag 1'
    },
    't2': {
      id: 1238,
      title: 'tag 2'
    }
  }
}

export default function reducer (state = initialState, action = {}) {
  return {
    question: state.question,
    article: state.article,
    annotations: annotationReducer(state.annotations, action),
    liqens: state.liqens,
    tags: state.tags
  }
}

function annotationReducer (state = initialState.annotations, action = {}) {
  switch (action.type) {
    case ActionTypes.CREATE_ANNOTATION_PENDING:
      const annotation = {
        tag: action.annotation.tag,
        target: action.annotation.target,
        checked: false,
        pending: true
      }

      return Object.assign({}, state, {
        [action.ref]: annotation
      })

    case ActionTypes.CREATE_ANNOTATION_SUCCESS:
      return Object.assign({}, state, {
        [action.ref]: {
          tag: state[action.ref].tag,
          target: state[action.ref].target,
          checked: state[action.ref].checked,
          pending: false,
          id: action.annotation.id
        }
      })

    case ActionTypes.CREATE_ANNOTATION_FAILURE:
    default:
      return state
  }
}
