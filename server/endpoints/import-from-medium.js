import {zipWith} from 'lodash'

export default function importFromMedium (req, res) {
  if (!req.body) {
    console.log('ENDPOINT importFromMedium > no `req.body` available. Rendering index')
    return res.render('index')
  }

  console.log('ENDPOINT importFromMedium > calling core.entries.create')
  const {uri, image, title} = req.body

  let uris = typeof uri === 'string' ? [uri] : uri
  let images = typeof uri === 'string' ? [image] : image
  let titles = typeof uri === 'string' ? [title] : title

  const array = zipWith(uris, images, titles, (uri, image, title) => (
    {
      title,
      entry_type: 'medium_post',
      medium_post: {
        uri,
        title,
        tags: [],
        copyright_cesion: true
      }
    }
  ))
    .map(obj => req.core.entries.create(obj))

  Promise.all(array)
    .then(() => {
      console.log('ENDPOINT importFromMedium > call successful. Redirecting to /')
      res.redirect('/')
    })
}
