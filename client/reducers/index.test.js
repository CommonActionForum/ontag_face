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

  const a2 = {
    tag: 'tag-0',
    target: {
      prefix: 'my-prefix 2',
      exact: 'my-exact 2',
      suffix: 'my-suffix 2'
    },
    checked: false,
    pending: true
  }

  it('should create a new annotation', () => {
    const oldState = {
      question,
      liqens,
      tags,
      annotations: {}, // No annotation
      newLiqen: {
        answer: [] // empty
      }
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
      annotations: {a1}, // The created annotation
      newLiqen: {
        answer: ['a1']
      }
    }

    expect(reducer(oldState, action)).toEqual(newState)
  })

  it('should replace the annotation in the newLiqen answer', () => {
    const oldState = {
      question,
      liqens,
      tags,
      annotations: {a1}, // We've created only one annotation
      newLiqen: {
        answer: ['a1'] // That annotation is part of the answer
      }
    }

    const action = {
      type: actions.CREATE_ANNOTATION_PENDING,
      annotation: a2,
      ref: 'a2'
    }

    const newState = {
      question,
      liqens,
      tags,
      annotations: {a1, a2}, // Now two annotations
      newLiqen: {
        answer: ['a1', 'a2'] // a2 adds to a1
      }
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
      },
      newLiqen: {
        answer: ['a1', null, null]
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
      },
      newLiqen: {
        answer: ['a1', null, null]
      }
    }

    expect(reducer(oldState, action)).toEqual(newState)
  })
})

describe('Reducer when CREATE_LIQEN_PENDING', () => {
  const annotations = {
    a1: {
      id: '9210',
      tag: 'tag-0',
      target: {
        prefix: 'my-prefix',
        exact: 'my-exact',
        suffix: 'my-suffix'
      },
      checked: false,
      pending: false
    },
    a2: {
      id: '9210',
      tag: 'tag-1',
      target: {
        prefix: 'my-prefix',
        exact: 'my-exact',
        suffix: 'my-suffix'
      },
      checked: false,
      pending: false
    },
    a3: {
      id: '9210',
      tag: 'tag-2',
      target: {
        prefix: 'my-prefix',
        exact: 'my-exact',
        suffix: 'my-suffix'
      },
      checked: false,
      pending: false
    }
  }

  it('should create the new Liqen', () => {
    const oldState = {
      question,
      tags,
      annotations,
      liqens: {},
      newLiqen: {
        answer: ['a1', 'a2', 'a3']
      }
    }

    const action = {
      type: actions.CREATE_LIQEN_PENDING,
      ref: 'l1'
    }

    const newState = {
      question,
      tags,
      annotations,
      liqens: {
        l1: {
          answer: ['a1', 'a2', 'a3'],
          pending: true
        }
      },
      newLiqen: {
        answer: ['a1', 'a2', 'a3'],
        pending: true
      }
    }

    expect(reducer(oldState, action)).toEqual(newState)
  })
})
