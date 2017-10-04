import entries from './entries'
import questions from './questions'

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
      } else if (email === 'john_medium@example.com') {
        return Promise.resolve({
          access_token: 'valid_medium_token'
        })
      } else {
        return Promise.reject(new Error('not authenticated'))
      }
    }
  },

  me: {
    index () {
      if (token === 'valid_token') {
        return Promise.resolve({
          username: 'john_example',
          name: 'John Example'
        })
      } else if (token === 'valid_medium_token') {
        return Promise.resolve({
          username: 'john_example',
          name: 'John Example',
          medium_credential: {
            user_id: 'saito_style'
          }
        })
      } else {
        return Promise.reject(new Error())
      }
    },

    add_medium_credential (query) {
      if (query && query.code && query.state) {
        return Promise.resolve({
          username: 'saito_style'
        })
      } else {
        return Promise.resolve({
          state: 'valid_state'
        })
      }
    }
  },

  questions,
  entries
})

export default core
