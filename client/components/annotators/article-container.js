import React from 'react'
import PropTypes from 'prop-types'
import ArticleBackground from './article-background'
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

  componentDidMount () {
    const {width, height, top, left} = this.node.getBoundingClientRect()
    this.setState({container: {
      width,
      height,
      top: top + window.scrollY,
      left: left + window.scrollX
    }})
  }

  getCallbacks (annotations) {
    let counter = 0
    const nodes = []

    return annotations.map(
      (a, i) => ({
        prefix: a.prefix,
        exact: a.exact,
        suffix: a.suffix,
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
    const paths = [
      {
        nodes: this.state.nodes
      }
    ]

    return (
      <div>
        <article ref={node => { this.node = node }}>
          {
            this.props.body.children.map((child, i) => (
              <SelectionMultiMarker
                key={i}
                fragments={this.annotations}
              >
                {convertObjectToReact(child)}
              </SelectionMultiMarker>
            ))
          }
        </article>
        <ArticleBackground
          height={this.state.container.height}
          width={this.state.container.width}
          paths={paths}
          style={{
            top: `${this.state.container.top}px`,
            left: `${this.state.container.left}px`,
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
      prefix: PropTypes.string.isRequired,
      exact: PropTypes.string.isRequired,
      suffix: PropTypes.string.isRequired
    })
  ),
  children: PropTypes.node
}
