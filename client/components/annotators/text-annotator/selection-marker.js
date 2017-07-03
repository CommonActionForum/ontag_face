import React from 'react'
import PropTypes from 'prop-types'
import zip from 'lodash/zipWith'
import split from './split'

export default function SelectionMarker ({ fragment, children }) {
  const text = nodeToString(children)
  const fragments = fragment
    ? split(fragment, text)
    : undefined

  return (
    <span>
      {
        React.Children.count(children) > 1
        ? renderArray(React.Children.toArray(children), fragments)
        : render(children, fragments)
      }
    </span>
  )
}

SelectionMarker.propTypes = {
  fragments: PropTypes.shape({
    prefix: PropTypes.string.isRequired,
    exact: PropTypes.string.isRequired,
    suffix: PropTypes.string.isRequired
  })
}

// Convert an array of nodes into a single string
function nodeToString (node) {
  const arr = React.Children.toArray(node)

  return arr.map(e => nodeToFlatString(e))
}

function nodeToFlatString (node) {
  if (React.Children.count(node) > 1) {
    return React.Children.toArray(node)
      .map(e => nodeToFlatString(e))
      .join('')
  } else if (typeof nodes === 'string') {
    return node
  } else if (node.type && node.props && node.props.children) {
    return nodeToFlatString(node.props.children)
  } else {
    return 'Non valid'
  }
}

// Render things
function render (e, fragments) {
  if (typeof e === 'string') {
    return renderString(e, fragments)
  } else if (e.type && e.props && e.props.children) {
    return renderElement(e, fragments)
  } else {
    return 'You are trying to render something not valid'
  }
}

function renderString (string, fragments) {
  if (fragments) {
    return [
      <span key={0}>fragments.prefix</span>,
      <mark key={1}>{fragments.exact}</mark>,
      <span key={2}>fragment.suffix</span>
    ]
  } else {
    return string
  }
}

function renderElement (element, fragments) {
  return React.createElement(
    element.type,
    element.props,
    <SelectionMarker fragment={fragments}>{element.props.children}</SelectionMarker>
  )
}

function renderArray (array, fragments) {
  if (fragments && array.length === fragments.length) {
    return zip(array, fragments, (child, fragment) => (
      <SelectionMarker fragment={fragments}>{child}</SelectionMarker>
    ))
  } else {
    return array.map((child, i) =>
      <SelectionMarker key={i}>{child}</SelectionMarker>
    )
  }
}
