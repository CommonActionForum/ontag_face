/**
 * This library simulates calls to a Ontag API.
 *
 * Useful for development. Do not use it in production
 */
const core = token => ({
  sessions: {
    create ({ email, password } = {}) {
      if (email === 'john@example.com' && password === 'secret') {
        return Promise.resolve({
          access_token: 'valid_token'
        })
      } else {
        return Promise.reject(new Error('not authenticated'))
      }
    }
  }
})

export default core
