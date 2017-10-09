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
    entry: state.entry,
    annotations: annotationReducer(state.annotations, action),
    answers: answerReducer(state.answers, action),
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

function answerReducer (answers = initialState.answers, action = {}) {
  switch (action.type) {
    case ActionTypes.ADD_ANSWER_ANNOTATION_PENDING:
      const {annotation_cid: annCid, answer_cid: ansCid} = action.answer_annotation

      return Object.assign({}, answers, {
        [ansCid]: {
          id: answers[ansCid].id,
          question_id: answers[ansCid].question_id,
          annotations: answers[ansCid].annotations.concat(annCid)
        }
      })

    case ActionTypes.ADD_ANSWER_ANNOTATION_SUCCESS:
      return answers

    case ActionTypes.REMOVE_ANSWER_ANNOTATION_PENDING:
      const {annotation_cid: annCid2, answer_cid: ansCid2} = action.answer_annotation

      return Object.assign({}, answers, {
        [ansCid2]: {
          id: answers[ansCid2].id,
          question_id: answers[ansCid2].question_id,
          annotations: answers[ansCid2].annotations.filter(a => a !== annCid2)
        }
      })

    default:
      return answers
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
