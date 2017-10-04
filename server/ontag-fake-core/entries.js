const entries = [
  {
    id: 1,
    title: 'Front-end Roles and Responsibilities',
    entry_type: 'medium_post',
    medium_post: {
      uri: 'https://hackernoon.com/front-end-roles-and-responsibilities-6ee8654f1649',
      license: 'copyright',
      image: 'https://cdn-images-1.medium.com/max/2000/1*ICPJKeH7mM3O_KReK5shSw.jpeg'
    }
  },
  {
    id: 2,
    title: 'JavaScript Monads Made Simple',
    entry_type: 'medium_post',
    medium_post: {
      uri: 'https://medium.com/javascript-scene/javascript-monads-made-simple-7856be57bfe8',
      image: 'https://cdn-images-1.medium.com/max/800/1*uVpU7iruzXafhU2VLeH4lw.jpeg'
    }
  },
  {
    id: 3,
    title: 'Designing for Human Attention',
    entry_type: 'medium_post',
    medium_post: {
      uri: 'https://uxplanet.org/designing-for-human-attention-ac0abe3d657d',
      image: 'https://cdn-images-1.medium.com/max/1000/1*-agEWwfDJfDPyZBkHXFvng.jpeg'
    }
  },
  {
    id: 4,
    title: 'Color, psicology and design',
    entry_type: 'medium_post',
    medium_post: {
      uri: 'https://uxplanet.org/how-color-can-effect-emotion-ccab0431b1d',
      image: 'https://cdn-images-1.medium.com/max/2000/1*-XUijhKMmb1vjickfPSyIQ.jpeg'
    }
  },
  {
    id: 5,
    title: 'Mobile Typography: 8 Steps Toward Powerful UI.',
    entry_type: 'medium_post',
    medium_post: {
      uri: 'https://uxplanet.org/mobile-typography-8-steps-toward-powerful-ui-deaf205274c5',
      image: 'https://cdn-images-1.medium.com/max/1000/1*Asobnxejkl99Pde8Td1ajg.png'
    }
  }
]

export default {
  index () {
    return Promise.resolve(entries)
  },

  create () {
    return Promise.resolve()
  },

  show () {
    return Promise.resolve(entries[0])
  }
}
