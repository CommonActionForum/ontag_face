import React from 'react'
import PropTypes from 'prop-types'
import ArticleBackground from './article-background'
import TextAnnotator from './text-annotator/text-annotator'
import SelectionMultiMarker from './text-annotator/selection-multi-marker'

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

export default class ArticleContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      container: {
        width: 0,
        height: 0,
        top: 0,
        left: 0
      },
      nodes: this.props.annotations.map(() => ({x: 0, y: 0}))
    }

    this.annotations = this.getCallbacks(this.props.annotations)
  }

  componentWillReceiveProps (/* nextProps */) {
    this.annotations = this.getCallbacks(this.props.annotations)
  }

  getCallbacks (annotations) {
    let counter = 0
    const nodes = []

    return annotations.map(
      (a, i) => ({
        fragment: a.fragment,
        colour: a.colour,
        ref: (node) => {
          if (node === null) {
            return
          }

          counter++
          const {top, left} = node.getBoundingClientRect()
          nodes[i] = {
            y: top + window.scrollY,
            x: left + window.scrollX
          }

          if (counter === nodes.length) {
            this.setState({nodes})
          }
        }
      })
    )
  }

  render () {
    let container = {
      width: 0,
      height: 0,
      top: 0,
      left: 0
    }

    if (this.articleNode) {
      const {width, height, top, left} = this.articleNode.getBoundingClientRect()

      container = {width, height, top, left}
    }

    const paths = [
      {
        nodes: this.state.nodes.map(
          ({x, y}) => ({
            x: x - container.left,
            y: y - container.top
          })
        )
      }
    ]

    return (
      <div style={{position: 'relative'}}>
        <article ref={node => { this.articleNode = node }}>
          {
            this.props.body.children.map((child, i) => (
              <TextAnnotator
                tags={this.props.tags}
                onCreateAnnotation={this.props.onAnnotate}
                key={i}
              >
                <SelectionMultiMarker
                  annotations={this.annotations}
                >
                  {convertObjectToReact(child)}
                </SelectionMultiMarker>
              </TextAnnotator>
            ))
          }
        </article>
        <ArticleBackground
          height={container.height}
          width={container.width}
          paths={paths}
          style={{
            top: `0`,
            left: `0`,
            position: 'absolute',
            zIndex: '-1'
          }}
        />
      </div>
    )
  }
}

ArticleContainer.propTypes = {
  annotations: PropTypes.arrayOf(
    PropTypes.shape({
      fragment: PropTypes.shape({
        prefix: PropTypes.string.isRequired,
        exact: PropTypes.string.isRequired,
        suffix: PropTypes.string.isRequired
      }),
      colour: PropTypes.string
    })
  ),
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      ref: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ),
  colours: PropTypes.object,
  children: PropTypes.node,
  onAnnotate: PropTypes.func.isRequired
}
