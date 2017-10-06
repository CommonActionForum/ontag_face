import * as ActionTypes from '../actions/index'

const initialState = {
  entry: {
    id: '1',
    title: 'Things that happen',
    entry_type: 'medium_post'
  },
  question: {
    id: '1',
    title: 'Answer this question',
    required_tags: [
      '1', '2'
    ],
    optional_tags: [
      '3'
    ]
  },
  annotations: {},
  answers: {},
  tags: {
    '1': {id: '-102', title: 'Good tag'},
    '2': {id: '-101', title: 'Wrong tag'},
    '3': {id: '-103', title: 'Medium size tag'}
  }
}

export default function reducer (state = initialState, action = {}) {
  return {
    question: state.question,
    article: state.article,
    annotations: annotationReducer(state.annotations, action),
    liqens: liqenReducer(state.liqens, action),
    tags: state.tags,
    colors: colorReducer(state.colors, action)
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
        [action.cid]: annotation
      })

    case ActionTypes.CREATE_ANNOTATION_SUCCESS:
      return Object.assign({}, state, {
        [action.cid]: {
          tag: state[action.cid].tag,
          target: state[action.cid].target,
          checked: state[action.cid].checked,
          pending: false,
          id: action.annotation.id.toString()
        }
      })

      // case ActionTypes.CREATE_ANNOTATION_FAILURE
    default:
      return state
  }
}

function liqenReducer (liqens = initialState.liqens, action = {}) {
  switch (action.type) {
    case ActionTypes.CREATE_LIQEN_PENDING:
      const liqen = {
        answer: action.liqen.answer
      }

      return Object.assign({}, liqens, {
        [action.cid]: liqen
      })

    case ActionTypes.CREATE_LIQEN_SUCCESS:
      return Object.assign({}, liqens, {
        [action.cid]: {
          answer: liqens[action.cid].answer,
          id: action.liqen.id.toString()
        }
      })

    case ActionTypes.EDIT_LIQEN_PENDING:
      return Object.assign({}, liqens, {
        [action.cid]: {
          answer: action.liqen.answer,
          id: liqens[action.cid].id.toString()
        }
      })

      // case ActionTypes.EDIT_LIQEN_SUCCESS
      // case ActionTypes.EDIT_LIQEN_FAILURE
    default:
      return liqens
  }
}

function colorReducer (colors = initialState.colors, action = {}) {
  switch (action.type) {
    case ActionTypes.CHANGE_LIQEN_COLOR:
      return Object.assign({}, colors, {
        [action.color]: action.liqen
      })

    default:
      return colors
  }
}
