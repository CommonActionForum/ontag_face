/* eslint-env jest */
import * as actions from '../actions/index'
import reducer from './index'

// Things that don't change
const question = {
  id: 'q0',
  title: 'question',
  answer: [
    { tag: 'tag-0', required: true },
    { tag: 'tag-1', required: true },
    { tag: 'tag-2', required: true }
  ]
}

const tags = {
  'tag-0': {
    id: '0',
    title: 'tag 0'
  },
  'tag-1': {
    id: '1',
    title: 'tag 1'
  },
  'tag-2': {
    id: '2',
    title: 'tag 2'
  }
}

describe('Reducer when CREATE_ANNOTATION_PENDING', () => {
  const liqens = {}

  // Two example annotations
  // Both have the same tag "tag-0"
  const a1 = {
    tag: 'tag-0',
    target: {
      prefix: 'my-prefix',
      exact: 'my-exact',
      suffix: 'my-suffix'
    },
    checked: false,
    pending: true
  }

  it('should create a new annotation', () => {
    const oldState = {
      question,
      liqens,
      tags,
      annotations: {} // No annotation
    }

    const action = {
      type: actions.CREATE_ANNOTATION_PENDING,
      annotation: a1,
      ref: 'a1'
    }

    const newState = {
      question,
      liqens,
      tags,
      annotations: {a1} // The created annotation
    }

    expect(reducer(oldState, action)).toEqual(newState)
  })
})

describe('Reducer when CREATE_ANNOTATION_SUCCESS', () => {
  const liqens = {}

  it('should mark the annotation as not pending', () => {
    const oldState = {
      question,
      liqens,
      tags,
      annotations: {
        a1: {
          tag: 'tag-0',
          target: {
            prefix: 'my-prefix',
            exact: 'my-exact',
            suffix: 'my-suffix'
          },
          checked: false,
          pending: true
        }
      }
    }

    const action = {
      type: actions.CREATE_ANNOTATION_SUCCESS,
      annotation: {
        id: '9210',
        tag: 'tag-0',
        target: {
          prefix: 'my-prefix',
          exact: 'my-exact',
          suffix: 'my-suffix'
        },
        checked: false,
        pending: true
      },
      ref: 'a1'
    }

    const newState = {
      question,
      liqens,
      tags,
      annotations: {
        a1: {
          id: '9210', // Now has an ID
          tag: 'tag-0',
          target: {
            prefix: 'my-prefix',
            exact: 'my-exact',
            suffix: 'my-suffix'
          },
          checked: false,
          pending: false // Now pending is false
        }
      }
    }

    expect(reducer(oldState, action)).toEqual(newState)
  })
})
