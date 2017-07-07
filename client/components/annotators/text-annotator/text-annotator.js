/* global document */
/**
 * Le Grand Annotator
 *
 * Inputs
 * - Array of tags
 *
 * Callbacks
 * - onAnnotate()  - Create an annotation (tag + target)
 */

import React from 'react'
import PropTypes from 'prop-types'

import Marker from './marker'
import Tooltip from './tag-tooltip'

export default class TextAnnotator extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      newAnnotation: {
        target: null
      }
    }

    this.handleHighlight = this.handleHighlight.bind(this)
    this.handleUnhighlight = this.handleUnhighlight.bind(this)
  }

  handleHighlight (fragment, range) {
    this.setState({
      newAnnotation: { target: fragment, range: range.getBoundingClientRect() }
    })
  }

  handleUnhighlight () {
    this.setState({
      newAnnotation: { target: null }
    })
  }

  handleSelectTag (tag) {
    if (this.state.newAnnotation.target) {
      this.props.onCreateAnnotation({
        target: this.state.newAnnotation.target,
        tag
      })

      document.getSelection().removeAllRanges()
      this.setState({
        newAnnotation: { target: null }
      })
    }
  }

  render () {
    return (
      <div>
        <div ref={node => (this.paragraph = node)}>
          <Marker
            onHighlight={(fragment, range) =>
              this.handleHighlight(fragment, range)}
            onUnhighlight={() => this.handleUnhighlight()}
          >
            {this.props.children}
          </Marker>
        </div>
        <div ref={node => (this.tooltip = node)}>
          {
            this.state.newAnnotation.target &&
            <Tooltip
              list={this.props.tags}
              position={this.state.newAnnotation.range}
              onSelect={tag => this.handleSelectTag(tag)}
              onUnselect={() => this.handleUnselectTag()}
            />
          }
        </div>
      </div>
    )
  }
}

TextAnnotator.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      ref: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ),
  children: PropTypes.node,
  onCreateAnnotation: PropTypes.func.isRequired
}
