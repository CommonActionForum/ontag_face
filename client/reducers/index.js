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

const addObject = oldState => (key, value) => Object.assign({}, oldState, {[key]: value})
const replaceObject = oldState => (key, value) => Object.assign({}, oldState, {
  [key]: Object.assign({}, oldState[key], value)
})
const removeObject = oldState => key => {
  const obj = {}
  for (let k in oldState) {
    if (k !== key) {
      obj[k] = oldState[k]
    }
  }
  return obj
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
  const addAnnotation = addObject(state)
  const replaceAnnotation = replaceObject(state)
  const removeAnnotation = removeObject(state)

  switch (action.type) {
    case ActionTypes.CREATE_ANNOTATION_PENDING:
      return addAnnotation(action.cid, {
        tag: action.annotation.tag,
        target: action.annotation.target,
        checked: false,
        pending: true
      })

    case ActionTypes.CREATE_ANNOTATION_SUCCESS:
      return replaceAnnotation(action.cid, {
        pending: false,
        id: action.annotation.id.toString()
      })

      // case ActionTypes.CREATE_ANNOTATION_FAILURE
    case ActionTypes.DELETE_ANNOTATION_PENDING:
      return removeAnnotation(action.cid)

    default:
      return state
  }
}

function answerReducer (answers = initialState.answers, action = {}) {
  const replaceAnswer = replaceObject(answers)

  switch (action.type) {
    case ActionTypes.ADD_ANSWER_ANNOTATION_PENDING:
      const {annotation_cid: annCid, answer_cid: ansCid} = action.answer_annotation

      return replaceAnswer(ansCid, {
        annotations: answers[ansCid].annotations.concat(annCid)
      })

    case ActionTypes.ADD_ANSWER_ANNOTATION_SUCCESS:
      return answers

    case ActionTypes.REMOVE_ANSWER_ANNOTATION_PENDING:
      const {annotation_cid: annCid2, answer_cid: ansCid2} = action.answer_annotation

      return replaceAnswer(ansCid2, {
        annotations: answers[ansCid2].annotations.filter(a => a !== annCid2)
      })

    default:
      return answers
  }
}

function colorReducer (colors = initialState.colors, action = {}) {
  const addColor = addObject(colors)

  switch (action.type) {
    case ActionTypes.CHANGE_LIQEN_COLOR:
      return addColor(action.color, action.liqen)

    default:
      return colors
  }
}
