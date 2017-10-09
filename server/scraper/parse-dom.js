import toPairs from 'lodash/fp/toPairs'

/** Get the Body of the DOM. Return it as plain JS object */
function getBodyObject ($) {
  const container = getContainer($)

  // Convert the root element into an array
  const children = []
  container
    .children()
    .map((i, el) => {
      children.push(convertToNode($(el)[0]))
    })

  return {
    children: children
      .filter(child => child !== null),
    name: 'div',
    attrs: {}
  }
}

/** Get the Body of the DOM. Return it as text */
function getBodyHtml ($) {
  const object = getBodyObject($)
  return convertToText(object)
}

/** Get the metadata from the DOM. Return it as object */
function getMetadata ($) {
  const image = ($('figure[representativeofpage=true] img').attr('src') ||
                 $('meta[property="og:image"]').attr('content') ||
                 '')

  const dateStr = ($('meta[property="article:modified_time"]').attr('content') ||
                   $('meta[property="article:published_time"]').attr('content') ||
                   $('meta[name="DC.date.issued"]').attr('content') ||
                   $('meta[property=date]').attr('content') ||
                   $('.news-body-date time').attr('datetime') ||
                   '').replace(' ', '')

  const ms = Date.parse(dateStr)

  const publishedDate = isNaN(ms) ? 0 : new Date(ms)

  const author = ($('meta[name=author]').attr('content') ||
                  $('[itemprop=articleBody] .data [itemprop=author] [itemprop=name]').text().trim() ||
                  $('article .news-author [itemprop=author] [itemprop=name]').text().trim() ||
                  $('article [itemprop=name]').text().trim() ||
                  $('.main [itemprop=author]').text().trim() ||
                  $('.cuerpo-articulo [href^="/autor"]').text().trim() ||
                  $('.news-info-box-author [itemprop=author]').text().trim() ||
                  // For ara - Currently not working
                  // $('#content p.pg-bkn-dateline small').text().trim() ||
                  // For eldiario.es
                  $('#content address.dateline small').text().trim() ||
                  // The following 2 lines are for huffingtonpost
                  $('article .info .thirdparty-logo').text().trim() ||
                  $('article .info .name.fn').text().trim() ||
                  $('.detalleFullTexto .author a').text().trim() ||
                  '')

  const title = ($('meta[property="og:title"]').attr('content') ||
                 '')

  return {
    image,
    publishedDate,
    source: {
      author
    },
    title
  }
}

/** Get the JSON from the DOM. Return it as object */
function getJson ($) {
  return {}
}

// private
function getContainer ($) {
  const selectors = [
    '.postArticle .section-inner',
    '[itemprop=articleBody] [itemProp=text]',
    '[itemprop=articleBody]',
    '#cuerpo_noticia',
    '#edi-body',
    '#news-body-center',
    '.cuerpo-articulo > div',
    '.main .cuerpo-noticia',
    '.detalleFullTexto .editorHTML .text',
    '#content .mce-body',
    '#content .entry',
    '#mainentrycontent',
    '[class*="body-text"]',
    '[class*="bodytext"]',
    '.news-content',
    '<div></div>'
  ]

  for (let i = 0; i < selectors.length; i++) {
    if ($(selectors[i]).length > 0) {
      return $(selectors[i])
    }
  }
}

// private
// convert a cheerio element into a JS object representing a node
function convertToNode (element) {
  switch (element.type) {
    case 'tag':
      if (['a', 'p', 'strong', 'em', 'b', 'em', 'h3', 'blockquote', 'pre'].indexOf(element.name) === -1) {
        return null
      }

      const ret = {
        name: element.name,
        attrs: filterAttributes(element.name, element.attribs),
        children: element
          .children
          .map(child => convertToNode(child))
          .filter(child => child !== null)
      }

      if (ret.children.length === 0) {
        return null
      }

      return ret
    case 'text':
      return element.data

    default:
      return '---'
  }
}

// private
// convert a JS object node into a text
function convertToText (object) {
  switch (typeof object) {
    case 'string':
      return object

    case 'object':
      const attrs = toPairs(object.attrs)
        .map(([name, value]) => `${name}="${value}"`)

      const tag = [object.name].concat(attrs)
                               .join(' ')

      const children = object
        .children
        .map(child => convertToText(child))
        .join('')

      return `<${tag}>${children}</${object.name}>`
  }
  return '<' + object.name + '>'
}

// Filter the html attributes
// Return only the relevant ones
function filterAttributes (name, attributes) {
  const filtered = {}

  if (attributes.href) {
    filtered.href = attributes.href
  }

  return filtered
}

module.exports = {
  getBodyObject,
  getBodyHtml,
  getMetadata,
  getJson
}
