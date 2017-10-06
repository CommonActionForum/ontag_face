export const a1 = {
  id: '1',
  tag_id: '1',
  entry_id: '1',
  target: {
    type: 'TextQuoteSelector',
    prefix: 'One of my biggest regrets in life is that I failed to ',
    exact: 'understand the significance',
    suffix: ' of that lesson early on. I learned the essence of software design far too late in life.'
  }
}

export const a2 = {
  id: '2',
  tag_id: '2',
  entry_id: '1',
  target: {
    type: 'TextQuoteSelector',
    prefix: 'Composition: “The act of ',
    exact: 'combining parts or elements',
    suffix: ' to form a whole.” ~ Dictionary.com'
  }
}

export const a3 = {
  id: '3',
  tag_id: '3',
  entry_id: '1',
  target: {
    type: 'TextQuoteSelector',
    prefix: '',
    exact: 'We must do better.',
    suffix: ''
  }
}

export default {
  index () {
    return Promise.resolve([a1, a2, a3])
  },

  show () {
    return Promise.resolve(a1)
  },

  create (params) {
    return Promise.resolve(Object.assign(params, {
      id: parseInt(Math.random() * 1000)
    }))
  }
}
