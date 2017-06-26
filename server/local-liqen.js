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
  },

  articles: {
    index () {
      return Promise.resolve([
        {
          id: 2,
          title: 'Fuga de cerebros: ¿dolor de cabeza para Latinoamérica?',
          source: {
            uri: 'http://www.bancomundial.org/es/news/feature/2013/11/06/fuga-cerebros-latinoamerica'
          }
        },
        {
          id: 3,
          title: '¿Hacia dónde emigran los talentos del mundo?',
          source: {
            uri: 'http://gestion.pe/empleo-management/hacia-donde-emigran-talentos-mundo-2173592'
          }
        }
      ])
    },

    show () {
      return Promise.resolve({
        'title': 'Fuga de cerebros: ¿dolor de cabeza para Latinoamérica?',
        'source': {
          'uri': 'http://www.bancomundial.org/es/news/feature/2013/11/06/fuga-cerebros-latinoamerica',
          'target': {
            'value': '/html/body/div[6]/div[1]/div[2]/div[1]/div[1]/div/div/div/div[2]/div[1]/div/div/div/div/div[3]/section/div',
            'type': 'XPathSelector'
          }
        },
        'id': 2
      })
    }
  },

  questions: {
    show () {
      return Promise.resolve({
        'title': 'Describe the migration flow of the highly qualified people',
        'id': 1,
        'answer': [
          { 'tag': 1, 'required': true },
          { 'tag': 2, 'required': true },
          { 'tag': 3, 'required': true }
        ]
      })
    }
  },

  tags: {
    show (id) {
      return Promise.resolve({
        id,
        title: ['Place of origin', 'Reason', 'Destination'][id - 1]
      })
    }
  },

  annotations: {
    index () {
      return Promise.resolve([
        {id: 2, author: 1, article_id: 2},
        {id: 31, author: 1, article_id: 2}
      ])
    },

    show (id) {
      switch (id) {
        case 2:
          return Promise.resolve({
            id: 2,
            author: 1,
            article_id: 2,
            target: {
              type: 'TextQuoteSelector',
              prefix: 'Hace más de cinco años que se fue de Colombia, y afirma que no tiene intención de regresar, porque “',
              exact: 'aquí se te valora más como profesional',
              suffix: '”.'
            },
            tags: [
              {title: 'Reason', id: 2}
            ]
          })

        case 31:
          return Promise.resolve({
            id: 31,
            author: 1,
            article_id: 2,
            target: {
              type: 'TextQuoteSelector',
              prefix: 'El colombiano Stefano Badalacchi es uno de ellos. Son las 7 AM de un húmedo día de otoño en ',
              exact: 'París',
              suffix: '. Badalacchi, de 24 años, se ajusta la corbata al cuello mientras echa llave a la puerta de casa, acomoda en su hombro la bolsa con la ‘compu’, y se dirige hacia el metro que le llevará a su nuevo puesto de trabajo en Ivry Sur Senne, como analista económico en una organización no gubernamental.'
            },
            tags: [
              {title: 'Destination', id: 3}
            ]
          })

        default:
          return Promise.resolve({})
      }
    },

    create (obj) {
      return Promise.resolve(Object.assign({
        id: Math.floor(Math.random() * 1000)
      }, obj))
    }
  },

  liqens: {
    index () {
      return Promise.resolve([
        {question_id: 1, id: 97}
      ])
    },

    show () {
      return Promise.resolve({
        id: 97,
        question_id: 1,
        annotations: [
          {id: 31},
          {id: 2}
        ]
      })
    },

    create (obj) {
      return Promise.resolve(Object.assign({
        id: Math.floor(Math.random() * 1000)
      }, obj))
    }
  }
})

export default localLiqen
