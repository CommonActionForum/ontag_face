import url from 'url'
import request from 'request-promise'
import cheerio from 'cheerio'
import parse from './parse'

/**
 * A full article object
 *
 * @typedef {Object} Article
 * @property {string} title         - The title of the article
 * @property {string} html          - The content of the article in HTML
 * @property {string} image         - The heading image URI of the article
 * @property {Date}   publishedDate - The publishing date of the article
 * @property {object} json          - Raw JSON object obtained from the article
 */

/**
 * @private
 */
function getMedia (hostname) {
  const patterns = {
    abc: /abc\.es/,
    ara: /ara\.cat/,
    elconfidencial: /elconfidencial\.com/,
    eldiario: /eldiario\.es/,
    elespanol: /elespanol\.com/,
    elmundo: /elmundo\.es/,
    elpais: /elpais\.com/,
    elperiodico: /elperiodico\.com/,
    esdiario: /esdiario\.com/,
    europapress: /europapress\.es/,
    huffingtonpost: /huffingtonpost\.es/,
    lainformacion: /lainformacion\.com/,
    larazon: /larazon\.es/,
    lavanguardia: /lavanguardia\.com/,
    lavozdegalicia: /lavozdegalicia\.es/,
    libertaddigital: /libertaddigital\.com/,
    okdiario: /okdiario\.com/,
    publico: /publico\.es/
  }

  for (const id in patterns) {
    if (patterns[id].test(hostname)) {
      return id
    }
  }
  return null
}

/**
 * Get the data of an article given its URI
 *
 * @param {string} uri   URI of the news article
 *
 * @return {Promise<Article>} Promise of the article
 */
module.exports = function downloadArticle (uri) {
  const media = getMedia(url.parse(uri).hostname)

  if (!media) {
    console.warn('The provided URI do not match with any known media. It may fail')
    console.warn('Provided URI: %s', uri)
  }

  const options = {
    transform: function (body) {
      return cheerio.load(body)
    },
    uri
  }

  return request(options)
    .then(parse)
}
