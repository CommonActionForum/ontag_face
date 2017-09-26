export default function connectWithMedium (req, res) {
  console.log('ENDPOINT connectWithMedium. Calling core.me.medium.create()')
  req
    .core.me.medium.create()
    .then(({state}) => {
      console.log('ENDPOINT connectWithMedium. Call successful')
      console.log('ENDPOINT connectWithMedium. Redirecting to Medium')
      res.send('Hello, Im medium')
    })
}
