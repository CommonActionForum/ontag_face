const extractBodyObjectFromDom = require('./parse-dom').getBodyObject
const extractBodyHtmlFromDom = require('./parse-dom').getBodyHtml
const extractMetadataFromDom = require('./parse-dom').getMetadata
const extractJsonFromDom = require('./parse-dom').getJson
const extractMetadataFromJson = require('./parse-json').getMetadata
const mergeMetadata = require('./merge-metadata')

module.exports = function parse ($) {
  const bodyObject = extractBodyObjectFromDom($)
  const bodyHtml = extractBodyHtmlFromDom($)
  const metadata1 = extractMetadataFromDom($)

  const metadata2 = extractMetadataFromJson(extractJsonFromDom($))

  return {
    body: {
      html: bodyHtml,
      object: bodyObject
    },
    metadata: mergeMetadata(metadata1, metadata2)
  }
}
