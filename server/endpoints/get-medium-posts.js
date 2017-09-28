import fetch from 'isomorphic-fetch'

export default function getMediumPosts (req, res) {
  if (!req.query.user_id) {
    console.log('ENDPOINT getMediumPosts > missing parameter `user_id`')
    return res.send({})
  }

  if (process.env.ONTAG_FAKE_CORE === 'true') {
    console.log('ENDPOINT getMediumPosts > sending response')
    res.send([
      {
        title: 'Front-end Roles and Responsibilities',
        uri: 'https://hackernoon.com/front-end-roles-and-responsibilities-6ee8654f1649',
        image: 'https://cdn-images-1.medium.com/max/2000/1*ICPJKeH7mM3O_KReK5shSw.jpeg'
      },
      {
        title: 'JavaScript Monads Made Simple',
        uri: 'https://medium.com/javascript-scene/javascript-monads-made-simple-7856be57bfe8',
        image: 'https://cdn-images-1.medium.com/max/800/1*uVpU7iruzXafhU2VLeH4lw.jpeg'
      },
      {
        title: 'Designing for Human Attention',
        uri: 'https://uxplanet.org/designing-for-human-attention-ac0abe3d657d',
        image: 'https://cdn-images-1.medium.com/max/1000/1*-agEWwfDJfDPyZBkHXFvng.jpeg'
      },
      {
        title: 'Color, psicology and design',
        uri: 'https://uxplanet.org/how-color-can-effect-emotion-ccab0431b1d',
        image: 'https://cdn-images-1.medium.com/max/2000/1*-XUijhKMmb1vjickfPSyIQ.jpeg'
      },
      {
        title: 'Mobile Typography: 8 Steps Toward Powerful UI.',
        uri: 'https://uxplanet.org/mobile-typography-8-steps-toward-powerful-ui-deaf205274c5',
        image: 'https://cdn-images-1.medium.com/max/1000/1*Asobnxejkl99Pde8Td1ajg.png'
      }
    ])
  } else {
    const userId = req.query.user_id
    const apiKey = process.env.RSS2JSON_API_KEY
    const url = `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F%40${userId}&api_key=${apiKey}`

    console.log('ENDPOINT getMediumPosts > getting RSS')
    console.log(url)
    fetch(url)
      .then(response => response.json())
      .then(({items}) => {
        console.log('ENDPOINT getMediumPosts > Reading RSS')

        const entries = items
          .map(
            ({title, link}) => ({title, uri: link, image: ''})
          )
        res.send(entries)
      })
  }
}
