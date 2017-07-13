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
  colors: {
    '#FFAB40': undefined,
    '#E91E63': undefined,
    '#E040FB': undefined,
    '#AA00FF': undefined,
    '#9FA8DA': undefined,
    '#2962FF': undefined,
    '#18FFFF': undefined,
    '#B2FF59': undefined,
    '#EEFF41': undefined,
    '#FFFFFF': undefined
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
