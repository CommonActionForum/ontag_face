import { a1, a2, a3 } from './annotations'

const ans1 = {
  id: '1',
  question_id: '1',
  annotations: [
    a1, a2, a3
  ]
}

export default {
  index () {
    return Promise.resolve([ans1])
  },

  show () {
    return Promise.resolve(ans1)
  },

  add_annotation (/* id, annotation_id */) {
    return Promise.resolve(ans1)
  },

  remove_annotation (/* id, annotation_id */) {
    return Promise.resolve(ans1)
  }
}
