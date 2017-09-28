export default function connectWithMedium (req, res) {
  console.log('ENDPOINT connectWithMedium. Calling core.me.medium.create()')
  req
    .core.me.add_medium_credential()
    .then(({state}) => {
      console.log('ENDPOINT connectWithMedium. Call successful')
      console.log('ENDPOINT connectWithMedium. Redirecting to Medium')

      const clientId = process.env.MEDIUM_CLIENT_ID || 'c733d40fdd71'
      const redirectUri = encodeURIComponent(process.env.MEDIUM_REDIRECT_URI || 'https://example.com/ontag')
      const medium = 'https://medium.com/m/oauth/authorize?' +
        `client_id=${clientId}` +
        `&scope=basicProfile` +
        `&state=${state}` +
        `&response_type=code` +
        `&redirect_uri=${redirectUri}`
      res.redirect(medium)
    })
}
