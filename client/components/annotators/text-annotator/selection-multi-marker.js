import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { fragmentArray } from './fragment'

const UnstyledBall = ({nodeRef, style, className, colour}) => (
  <span ref={ref => nodeRef(ref)}
    style={style}
    className={className}
  >
    <BallButton colour={colour} />
  </span>
)

const UnstyledBallButton = ({className, colour}) => (
  <button
    className={className}
    style={{
      background: `radial-gradient(ellipse at center, ${colour} 0%, rgba(255,255,255,0) 60%)`
    }} />
)

const Ball = styled(UnstyledBall)`
  position:relative;
`

const BallButton = styled(UnstyledBallButton)`
  position: absolute;
  top: -10px;
  left: -10px;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  border: none;
`

export default function SelectionMultiMarker ({ annotations, children }) {
  // Render diferently depending on Array, Element or "plain" thing
  let renderedChildren

  if (React.Children.count(children) > 1) {
    renderedChildren = renderArray(children, annotations)
  } else if (children.type && children.props && children.props.children) {
    renderedChildren = renderElement(children, annotations)
  } else {
    renderedChildren = renderSimple(children, annotations)
  }

  return renderedChildren
}

SelectionMultiMarker.propTypes = {
  annotations: PropTypes.arrayOf(
    PropTypes.shape({
      fragment: PropTypes.shape({
        prefix: PropTypes.string.isRequired,
        exact: PropTypes.string.isRequired,
        suffix: PropTypes.string.isRequired
      }).isRequired,
      colour: PropTypes.string,
      ref: PropTypes.func
    })
  ),
  children: PropTypes.node.isRequired
}

export function renderSimple (thing, annotations) {
  const str = '' + thing
  // console.log(annotations)
  const arr = annotations
    .filter(a => a.fragment.prefix + a.fragment.exact + a.fragment.suffix === thing)
    .map(a => ({
      ref: a.ref,
      colour: a.colour,
      size: (a.fragment.prefix + a.fragment.exact).length
    }))
    .sort((a, b) => a.size - b.size)

  let result

  if (arr.length > 0) {
    result = []
    result.push(str.slice(0, arr[0].size))

    if (arr[0].ref) {
      result.push(<Ball key={0} nodeRef={arr[0].ref} colour={arr[0].colour} />)
    }

    for (let i = 1; i < arr.length; i++) {
      result.push(str.slice(arr[i - 1].size, arr[i].size))

      if (arr[i].ref) {
        result.push(<Ball key={i} nodeRef={arr[i].ref} colour={arr[i].colour} />)
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
    <SelectionMultiMarker annotations={fragments}>
      {element.props.children}
    </SelectionMultiMarker>
  )
}

export function renderArray (node, annotations) {
  const strArr = nodeToArray(node)
  const annotationsArray = annotations
    .filter(
      ({fragment}) =>
        fragment.prefix + fragment.exact + fragment.suffix === strArr.join('')
    )
    .map(annotation => {
      const fragment = annotation.fragment
      const arr = fragmentArray(strArr, fragment)

      // attach "ref" to the last element that has an "exact"
      let chosen = -1
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].exact !== '') {
          chosen = i
        }
      }

      if (chosen !== -1) {
        arr[chosen].ref = annotation.ref
      }

      return arr
        .map(fragment => ({
          colour: annotation.colour,
          ref: fragment.ref,
          fragment
        }))
    })

  const result = []
  const arr = React.Children.toArray(node)
  for (let i = 0; i < arr.length; i++) {
    result.push(
      <SelectionMultiMarker
        key={i}
        annotations={annotationsArray.map(f => f[i])}
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
