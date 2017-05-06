/**
 * Fake API Client
 */

const localLiqen = token => ({
  users: {
    show (id) {
      if (token === 'valid_token' && parseInt(id) === 1) {
        return Promise.resolve({
          id: 1,
          email: 'john@example.com'
        })
      } else {
        return Promise.reject(new Error('Not logged in'))
      }
    }
  },

  sessions: {
    create ({ email, password } = {}) {
      if (email === 'john@example.com' && password === 'secret') {
        return Promise.resolve({
          access_token: 'valid_token',
          expires: Math.floor(Date.now() / 1000 + 1000),
          user: {
            id: 1
          }
        })
      } else {
        return Promise.reject(new Error('not authenticated'))
      }
    }
  }
})

export default localLiqen
