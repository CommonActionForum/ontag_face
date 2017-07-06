import React from 'react'
import PropTypes from 'prop-types'
import { fragmentArray } from './fragment'

export default function SelectionMultiMarker ({ fragments, children }) {
  // Render diferently depending on Array, Element or "plain" thing
  let renderedChildren

  if (React.Children.count(children) > 1) {
    renderedChildren = renderArray(children, fragments)
  } else if (children.type && children.props && children.props.children) {
    renderedChildren = renderElement(children, fragments)
  } else {
    renderedChildren = renderSimple(children, fragments)
  }

  return renderedChildren
}

SelectionMultiMarker.propTypes = {
  fragments: PropTypes.arrayOf(
    PropTypes.shape({
      prefix: PropTypes.string.isRequired,
      exact: PropTypes.string.isRequired,
      suffix: PropTypes.string.isRequired,
      ref: PropTypes.func
    })
  ),
  children: PropTypes.node.isRequired
}

export function renderSimple (thing, fragments) {
  const Ball = ({nodeRef}) => (
    <span ref={ref => nodeRef(ref)}>BALL</span>
  )

  const str = '' + thing
  const arr = fragments
    .filter(f => f.prefix + f.exact + f.suffix === thing)
    .map(f => ({
      ref: f.ref,
      size: (f.prefix + f.exact).length
    }))
    .sort((a, b) => a.size - b.size)

  let result

  if (arr.length > 0) {
    result = []
    result.push(str.slice(0, arr[0].size))

    if (arr[0].ref) {
      result.push(<Ball key={0} nodeRef={arr[0].ref} />)
    }

    for (let i = 1; i < arr.length; i++) {
      result.push(str.slice(arr[i - 1].size, arr[i].size))

      if (arr[i].ref) {
        result.push(<Ball key={i} nodeRef={arr[i].ref} />)
      }
    }

    result.push(str.slice(arr[arr.length - 1].size))
  } else {
    result = thing
  }

  return (<span className='xxxx-root'>{result}</span>)
}

export function renderElement (element, fragments) {
  return React.createElement(
    element.type,
    element.props,
    <SelectionMultiMarker fragments={fragments}>
      {element.props.children}
    </SelectionMultiMarker>
  )
}

export function renderArray (node, fragments) {
  const strArr = nodeToArray(node)
  const fragmentsArray = fragments
    .map(fragment => {
      const arr = fragmentArray(strArr, fragment)

      // attach "ref" to the last element that has an "exact"
      let chosen = -1
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].exact !== '') {
          chosen = i
        }
      }

      if (chosen !== -1) {
        arr[chosen].ref = fragment.ref
      }

      return arr
    })

  const result = []
  const arr = React.Children.toArray(node)
  for (let i = 0; i < arr.length; i++) {
    result.push(
      <SelectionMultiMarker
        key={i}
        fragments={fragmentsArray.map(f => f[i])}
      >
        {arr[i]}
      </SelectionMultiMarker>
    )
  }

  return (
    <span className='xxxx--array'>{result}</span>
  )
}

// Convert a node into an array of strings
export function nodeToArray (node) {
  const arr = React.Children.toArray(node)

  if (arr.length > 1) {
    return arr.map(e => nodeToFlatString(e))
  } else {
    return [nodeToFlatString(node)]
  }
}

// Convert a node into a string
export function nodeToFlatString (node) {
  if (React.Children.count(node) > 1) {
    const arr = React.Children.toArray(node)

    return arr
      .map(e => nodeToFlatString(e))
      .join('')
  } else if (node.type && node.props && node.props.children) {
    return nodeToFlatString(node.props.children)
  } else {
    return node
  }
}
