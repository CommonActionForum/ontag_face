import React from 'react'
import TextAnnotator from './text-annotator/text-annotator'

function convertObjectToReact (obj, key) {
  if (typeof obj === 'string') {
    return obj
  } else {
    const children = obj.children.map((item, i) => convertObjectToReact(item, i))

    if (children.length === 1) {
      return React.createElement(obj.name, Object.assign({key}, obj.attrs), children[0])
    } else {
      return React.createElement(obj.name, Object.assign({key}, obj.attrs), children)
    }
  }
}

export default function ArticleAnnotator ({ body, onCreateAnnotation, tags }) {
  return (
    <div>
      {
        body.children.map((child, i) => (
          <TextAnnotator
            key={i}
            annotations={[]}
            tags={tags}
            onCreateAnnotation={onCreateAnnotation}
          >
            {convertObjectToReact(child)}
          </TextAnnotator>
        ))
      }
    </div>
  )
}
