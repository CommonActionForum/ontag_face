import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { fragmentArray } from './fragment'

const Ball = ({nodeRef, style, className, colors, onSelect}) => (
  <BallEnvelope>
    <BallContainer nodeRef={nodeRef}>
      <BallButton onClick={onSelect} />
      <BallColors colors={colors}/>
    </BallContainer>
  </BallEnvelope>
)

const UnstyledBallContainer = ({nodeRef, children, className}) => (
  <span ref={nodeRef} className={className}>
    {children}
  </span>
)

const UnstyledBallButton = ({onClick, className}) => (
  <button className={className} onClick={onClick}>
    <i className='fa fa-asterisk' />
  </button>
)

const UnstyledBallColors = ({colors, className}) => (
  <span className={className}>
    {
      colors.map(c => <BallColor key={c} color={c} />)
    }
  </span>
)

const BallEnvelope = styled.span`
  position: relative;
`

const BallContainer = styled(UnstyledBallContainer)`
  position: absolute;
  top: -10px;
  left: -4px;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: flex-start;
`

const BallButton = styled(UnstyledBallButton)`
  font-size: 20px;
  color: #6ed200;
  border: none;
  padding: 0;
  margin: 0;
  background: none;
`

const BallColors = styled(UnstyledBallColors)`
  background: none;
  height: 12px;
  display: flex;
  align-items: center;
  border-radius: 100%;
`

const BallColor = styled.span`
  border-radius: 100%;
  width: 8px;
  height: 8px;
  display: inline-block;
  background-color: ${p => p.color};
  margin: 2px;
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
      color: PropTypes.string,
      onSelect: PropTypes.func,
      nodeRef: PropTypes.func
    })
  ),
  children: PropTypes.node.isRequired
}

export function renderSimple (thing, annotations, onSelect) {
  const str = '' + thing
  // console.log(annotations)
  const arr = annotations
    .filter(a => a.fragment.prefix + a.fragment.exact + a.fragment.suffix === thing)
    .map(a => ({
      nodeRef: a.nodeRef,
      colors: a.colors,
      onSelect: a.onSelect,
      size: (a.fragment.prefix + a.fragment.exact).length
    }))
    .sort((a, b) => a.size - b.size)

  let result

  if (arr.length > 0) {
    result = []
    result.push(str.slice(0, arr[0].size))

    if (arr[0].nodeRef) {
      result.push(
        <Ball
          key={0}
          nodeRef={arr[0].nodeRef}
          colors={arr[0].colors}
          onSelect={arr[0].onSelect}
        />
      )
    }

    for (let i = 1; i < arr.length; i++) {
      result.push(str.slice(arr[i - 1].size, arr[i].size))

      if (arr[i].nodeRef) {
        result.push(
          <Ball
            key={i}
            nodeRef={arr[i].nodeRef}
            colors={arr[i].colors}
            onSelect={arr[i].onSelect}
          />
        )
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

      // attach "nodeRef" to the last element that has an "exact"
      let chosen = -1
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].exact !== '') {
          chosen = i
        }
      }

      if (chosen !== -1) {
        arr[chosen].nodeRef = annotation.nodeRef
      }

      return arr
        .map(fragment => ({
          color: annotation.color,
          nodeRef: fragment.nodeRef,
          onSelect: annotation.onSelect,
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
