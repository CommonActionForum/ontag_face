/* global document */
import React from 'react'
import PropTypes from 'prop-types'
import zip from 'lodash/zipWith'
import split from './split'

/**
 * Highlight a text and handles the highlighting action
 *
 * Inputs
 * - fragment to select (prefix, suffix, exact)
 *
 * Outputs
 * - onHighlight(fragment, position)
 */
export default class Marker extends React.Component {
  constructor (props) {
    super(props)
    this.handleSelection = this.handleSelection.bind(this)
    this.handleUnselection = this.handleUnselection.bind(this)
  }

  componentDidMount () {
    if (this.props.onHighlight) {
      document.addEventListener('keyup', this.handleSelection)
      document.addEventListener('mouseup', this.handleSelection)
      document.addEventListener('click', this.handleSelection)
      document.addEventListener('dblclick', this.handleSelection)
      document.addEventListener('scroll', this.handleSelection)
    }

    if (this.props.onUnhighlight) {
      document.addEventListener('selectionchange', this.handleUnselection)
    }
  }

  componentWillUnmount () {
    if (this.props.onHighlight) {
      document.removeEventListener('keyup', this.handleSelection)
      document.removeEventListener('mouseup', this.handleSelection)
      document.removeEventListener('click', this.handleSelection)
      document.removeEventListener('dblclick', this.handleSelection)
      document.removeEventListener('scroll', this.handleSelection)
    }

    if (this.props.onUnhighlight) {
      document.removeEventListener('selectionchange', this.handleUnselection)
    }
  }

  componentDidUpdate (prevProps) {
    const eq = (p1, p2) => p1.prefix === p2.prefix &&
                         p1.suffix === p2.suffix &&
                         p1.exact === p2.exact

    if (prevProps.fragment && this.props.fragment && !eq(prevProps.fragment, this.props.fragment)) {
      document.getSelection().removeAllRanges()
    }
  }

  handleUnselection () {
    const selection = document.getSelection()

    if (selection.rangeCount === 0 || !this.node) {
      this.props.onUnhighlight()
      return
    }

    const exactRange = selection.getRangeAt(0)
    const ancestor = exactRange.commonAncestorContainer

    if (
      (!this.node.contains(ancestor) && !this.node.isSameNode(ancestor)) ||
      exactRange.toString() === ''
    ) {
      this.props.onUnhighlight()
    }
  }

  handleSelection () {
    const selection = document.getSelection()

    if (selection.rangeCount === 0 || !this.node) {
      return
    }

    const exactRange = selection.getRangeAt(0)
    const ancestor = exactRange.commonAncestorContainer

    // Check that "this" contains the ancestor
    if (this.node.contains(ancestor) || this.node.isSameNode(ancestor)) {
      // Calculate the prefixRange and suffixRange
      const prefixRange = document.createRange()
      prefixRange.setStart(this.node, 0)
      prefixRange.setEnd(exactRange.startContainer, exactRange.startOffset)

      const prefix = prefixRange.toString()
      const exact = exactRange.toString()
      const suffix = this.node.textContent.slice(prefix.length + exact.length)

      if (exact !== '') {
        this.props.onHighlight({ prefix, exact, suffix }, exactRange)
      }
    }
  }

  render () {
    function renderNode (e, fragments) {
      if (typeof e === 'string' && fragments) {
        // eslint-disable-next-line react/jsx-key
        return [fragments.prefix, <mark>{fragments.exact}</mark>, fragments.suffix]
      } else if (typeof e === 'string') {
        return e
      } else if (e.type && e.props && e.props.children) {
        return React.createElement(
          e.type,
          e.props,
          <Marker fragment={fragments}>{e.props.children}</Marker>
        )
      } else {
        return 'You are trying to render something not-valid :('
      }
    }

    function renderArray (arr, fragments) {
      if (fragments && React.Children.count(arr) === fragments.length) {
        const arr1 = React.Children.toArray(arr)

        return zip(arr1, fragments, (child, fragment) => (
          <Marker fragment={fragment}>{child}</Marker>
        ))
      } else {
        return React.Children.map(arr, child => <Marker>{child}</Marker>)
      }
    }

    const children = this.props.children
    const text = childrenToString(this.props.children)
    const fragments = this.props.fragment
                    ? split(this.props.fragment, text)
                    : undefined

    return (
      <span
        ref={
          node => {
            this.node = node
          }}
      >
        {
          React.Children.count(children) > 1
          ? renderArray(children, fragments)
          : renderNode(children, fragments)
        }
      </span>
    )
  }
}

function childrenToString (e, flatten = false) {
  if (React.Children.count(e) > 1) {
    const arr = React.Children.toArray(e)

    if (flatten) {
      return arr.map(e => childrenToString(e, true)).join('')
    } else {
      return arr.map(e => childrenToString(e, true))
    }
  } else if (typeof e === 'string') {
    return e
  } else if (e.type && e.props && e.props.children) {
    return childrenToString(e.props.children, true)
  } else {
    return 'You are passing something not valid'
  }
}

Marker.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.node
  ]).isRequired,
  fragment: PropTypes.shape({
    prefix: PropTypes.string,
    exact: PropTypes.string,
    suffix: PropTypes.string
  }),
  onHighlight: PropTypes.func,
  onUnhighlight: PropTypes.func
}
