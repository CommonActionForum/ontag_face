const q1 = {
  id: 1,
  title: 'Describe the migration flow of the people',
  required_tags: [
    {id: 1, title: 'Place of origin'},
    {id: 2, title: 'Destination'}
  ],
  optional_tags: [
    {id: 3, title: 'Reason'}
  ]
}

export default {
  show () {
    return Promise.resolve(q1)
  }
}
