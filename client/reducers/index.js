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
  },
  newLiqen: {
    answer: [
      'a1'
    ]
  }
}

export default function reducer (state = initialState, action = {}) {
  return {
    question: state.question,
    article: state.article,
    annotations: annotationReducer(state.annotations, action),
    liqens: liqenReducer(state.liqens, action, state),
    tags: state.tags,
    newLiqen: newLiqenReducer(state.newLiqen, action, state)
  }
}

function newLiqenReducer (newLiqen, action, state) {
  switch (action.type) {
    case ActionTypes.ADD_ANNOTATION_TO_LIQEN:
      return {
        answer: newLiqen.answer.concat(action.ref)
      }

    case ActionTypes.REMOVE_ANNOTATION_TO_LIQEN:
      return {
        answer: newLiqen.answer.filter(a => a !== action.ref)
      }

    case ActionTypes.CREATE_ANNOTATION_PENDING:
      return {
        answer: newLiqen.answer.concat(action.ref)
      }

    case ActionTypes.CREATE_LIQEN_PENDING:
      return {
        answer: newLiqen.answer,
        pending: true
      }

    case ActionTypes.CREATE_LIQEN_SUCCESS:
      return {
        answer: []
      }

    default:
      return newLiqen
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

function liqenReducer (liqens, action = {}, state) {
  switch (action.type) {
    case ActionTypes.CREATE_LIQEN_PENDING:
      return Object.assign({}, liqens, {
        [action.ref]: {
          answer: state.newLiqen.answer,
          pending: true
        }
      })

    case ActionTypes.CREATE_LIQEN_SUCCESS:
      return Object.assign({}, liqens, {
        [action.ref]: {
          answer: liqens[action.ref].answer,
          pending: false
        }
      })
    case ActionTypes.CREATE_LIQEN_FAILURE:
    default:
      return liqens
  }
}
