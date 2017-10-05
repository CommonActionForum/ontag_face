import path from 'path'
import fs from 'fs'
import cheerio from 'cheerio'
import parse from '../scraper/parse'
import { downloadArticle } from '../scraper/download-article'

export default function parseArticle (req, res) {
  if (!req.query.uri) {
    console.log('ENDPOINT parseArticle > Missing query param `uri`')
    return res.send({})
  }

  if (process.env.ONTAG_FAKE_CORE === 'true') {
    const p = path.resolve(__dirname, 'medium.html')

    const article = cheerio.load(fs.readFileSync(p))
    const result = parse(article)

    console.log('ENDPOINT parseArticle > Sending results of the local medium article')

    // Retrieve the results
    res.send(result)
  } else {
    console.log('ENDPOINT parseArticle > Downloading and parsing article')

    return downloadArticle(req.query.uri)
      .then(article => {
        console.log('ENDPOINT parseArticle > Sending article')
        res.send(article)
      })
  }
}
