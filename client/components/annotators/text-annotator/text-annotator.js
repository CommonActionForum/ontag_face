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

import SelectionHandler from './selection-handler'
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
    this.handleDeselect = this.handleDeselect.bind(this)
  }

  handleHighlight (fragment, range) {
    this.setState({
      newAnnotation: { target: fragment, range: range.getBoundingClientRect() }
    })
  }

  handleDeselect () {
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
          <SelectionHandler
            onSelect={this.handleHighlight}
            onDeselect={this.handleDeselect}
          >
            {this.props.children}
          </SelectionHandler>
        </div>
        <div ref={node => (this.tooltip = node)}>
          {
            this.state.newAnnotation.target &&
            <Tooltip
              list={this.props.tags}
              position={this.state.newAnnotation.range}
              onSelect={tag => this.handleSelectTag(tag)}
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
      cid: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ),
  children: PropTypes.node,
  onCreateAnnotation: PropTypes.func.isRequired
}
