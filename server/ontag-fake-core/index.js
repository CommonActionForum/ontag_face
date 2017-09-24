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
  },

  me: {
    show (token) {
      if (token === 'valid_token') {
        return Promise.resolve({
          username: 'john_example',
          name: 'John Example'
        })
      } else {
        return Promise.reject(new Error())
      }
    }
  },

  questions: {
    show (id) {
      return Promise.resolve({
        title: 'Describe the migration flow of the highly qualified people'
      })
    }
  }
})

export default core
