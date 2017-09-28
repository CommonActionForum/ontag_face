import {zipWith} from 'lodash'

export default function importFromMedium (req, res) {
  if (!req.body) {
    console.log('ENDPOINT importFromMedium > no `req.body` available. Rendering index')
    return res.render('index')
  }

  console.log('ENDPOINT importFromMedium > calling core.entries.create')
  const {uri, image, title} = req.body
  const array = zipWith(uri, image, title, (uri, image, title) => (
    {
      title,
      entry_tipe: 'medium_post',
      medium_post: {
        uri,
        image,
        title
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
