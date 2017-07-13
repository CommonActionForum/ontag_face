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

const article = {
  id: 1000,
  title: 'article'
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

const colours = {
  'colour1': undefined,
  'colour2': undefined,
  'colour3': undefined,
  'colour4': undefined,
  'colour5': undefined
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
      article,
      liqens,
      tags,
      colours,
      annotations: {} // No annotation
    }

    const action = {
      type: actions.CREATE_ANNOTATION_PENDING,
      annotation: a1,
      cid: 'a1'
    }

    const newState = {
      question,
      article,
      liqens,
      tags,
      colours,
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
      article,
      liqens,
      tags,
      colours,
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
      cid: 'a1'
    }

    const newState = {
      question,
      article,
      liqens,
      tags,
      colours,
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

describe('Reducer when CREATE_LIQEN_PENDING', () => {
  it('should reduce correctly', () => {
    const annotations = {
      a10: {
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
      a78: {
        id: '54878',
        tag: 'tag-0',
        target: {
          prefix: 'my-prefix',
          exact: 'my-exact',
          suffix: 'my-suffix'
        },
        checked: false,
        pending: false
      }
    }

    const oldState = {
      question,
      article,
      liqens: {},
      tags,
      colours,
      annotations
    }

    const action = {
      type: actions.CREATE_LIQEN_PENDING,
      liqen: {
        answer: ['a10', 'a78']
      },
      cid: 'l1'
    }

    const newState = {
      question,
      article,
      liqens: {
        l1: {
          answer: ['a10', 'a78']
        }
      },
      tags,
      colours,
      annotations
    }

    expect(reducer(oldState, action)).toEqual(newState)
  })
})

describe('Reducer when CREATE_LIQEN_SUCCESS', () => {
  it('should reduce correctly', () => {
    const annotations = {
      a10: {
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
      a78: {
        id: '54878',
        tag: 'tag-0',
        target: {
          prefix: 'my-prefix',
          exact: 'my-exact',
          suffix: 'my-suffix'
        },
        checked: false,
        pending: false
      }
    }

    const oldState = {
      question,
      article,
      liqens: {
        l1: {
          answer: ['a10', 'a78']
        }
      },
      tags,
      colours,
      annotations
    }

    const action = {
      type: actions.CREATE_LIQEN_SUCCESS,
      liqen: {
        id: '21'
      },
      cid: 'l1'
    }

    const newState = {
      question,
      article,
      liqens: {
        l1: {
          id: '21',
          answer: ['a10', 'a78']
        }
      },
      tags,
      colours,
      annotations
    }

    expect(reducer(oldState, action)).toEqual(newState)
  })
})
describe('Reducer when EDIT_LIQEN_PENDING', () => {
  it('should reduce correctly', () => {
    const annotations = {
      a10: {
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
      a78: {
        id: '54878',
        tag: 'tag-0',
        target: {
          prefix: 'my-prefix',
          exact: 'my-exact',
          suffix: 'my-suffix'
        },
        checked: false,
        pending: false
      }
    }

    const oldState = {
      question,
      article,
      liqens: {
        l1: {
          id: '7890',
          answer: ['a10', 'a78']
        }
      },
      tags,
      colours,
      annotations
    }

    const action = {
      type: actions.EDIT_LIQEN_PENDING,
      liqen: {
        answer: ['a10']
      },
      cid: 'l1'
    }

    const newState = {
      question,
      article,
      liqens: {
        l1: {
          id: '7890',
          answer: ['a10']
        }
      },
      tags,
      colours,
      annotations
    }

    expect(reducer(oldState, action)).toEqual(newState)
  })
})

describe('Reducer when EDIT_LIQEN_SUCCESS', () => {})

describe('Reducer when CHANGE_LIQEN_COLOUR', () => {
  it('should reduce correctly', () => {
    const oldState = {
      question,
      article,
      liqens: {
        l1: {
          id: '7890',
          answer: ['a10']
        }
      },
      tags,
      colours: {
        'colour1': undefined
      },
      annotations: {}
    }

    const action = {
      type: actions.CHANGE_LIQEN_COLOUR,
      colour: 'colour1',
      liqen: 'l1'
    }

    const newState = {
      question,
      article,
      liqens: {
        l1: {
          id: '7890',
          answer: ['a10']
        }
      },
      tags,
      colours: {
        'colour1': 'l1'
      },
      annotations: {}
    }

    expect(reducer(oldState, action)).toEqual(newState)
  })
})
