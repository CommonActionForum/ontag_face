import React from 'react'
import PropTypes from 'prop-types'
import ArticleBackground from './article-background'
import ColorPicker from './color-picker'
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
      nodes: this.props.annotations.map(() => ({x: 0, y: 0, colors: []})),
      selectedNode: -1
    }

    this.handleChangeColor = this.handleChangeColor.bind(this)
    this.handleSelectAnnotation = this.handleSelectAnnotation.bind(this)
    this.handleCloseColorPicker = this.handleCloseColorPicker.bind(this)
    this.annotations = this.getCallbacks(this.props.annotations)
  }

  componentWillReceiveProps (nextProps) {
    this.annotations = this.getCallbacks(nextProps.annotations)
  }

  handleSelectAnnotation (selectedNode) {
    this.setState({
      selectedNode
    })
  }

  handleChangeColor (colorCode) {
    const selectedAnnotation = this.annotations[this.state.selectedNode]

    if (selectedAnnotation.colors.indexOf(colorCode) !== -1) {
      console.log('remove', colorCode)
      this.props.onRemoveAnnotationColor(selectedAnnotation.cid, colorCode)
    } else {
      console.log('add', colorCode)
      this.props.onAddAnnotationColor(selectedAnnotation.cid, colorCode)
    }
  }

  handleCloseColorPicker () {
    this.setState({
      selectedNode: -1
    })
  }

  getCallbacks (annotations) {
    let counter = 0
    const nodes = []

    return annotations.map(
      (a, i) => ({
        cid: a.cid,
        fragment: a.fragment,
        colors: a.colors,
        color: (a.colors || [''])[0],
        nodeRef: (node) => {
          if (node === null) {
            return
          }

          counter++
          const {top, left} = node.getBoundingClientRect()
          nodes[i] = {
            y: top + window.scrollY,
            x: left + window.scrollX,
            colors: a.colors
          }

          if (counter === nodes.length) {
            this.setState({nodes})
          }
        },
        onSelect: () => {
          this.handleSelectAnnotation(i)
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

    const filterByColor = color => node => node.colors.indexOf(color) !== -1
    const paths = (this.props.colors || [])
      .map(
        color => ({
          color,
          nodes: this
            .state.nodes
            .filter(filterByColor(color))
            .map(
              ({x, y}) => ({
                x: x - container.left - window.scrollX,
                y: y - container.top - window.scrollY
              })
            )
        })
      )
      .filter(
        path => path.nodes.length > 0
      )

    const selectedAnnotation = this.state.selectedNode !== -1
                             ? this.annotations[this.state.selectedNode]
                             : null

    const nodePosition = this.state.selectedNode !== -1
                       ? this.state.nodes[this.state.selectedNode]
                       : null

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
        {
          selectedAnnotation && (
            <ColorPicker
              list={this.props.colors.map(
                  c => ({
                    code: c,
                    title: '',
                    selected: selectedAnnotation.colors.indexOf(c) !== -1
                  })
                )}
              onSelect={this.handleChangeColor}
              position={{
                x: nodePosition.x - container.left - window.scrollX,
                y: nodePosition.y - container.top - window.scrollY
              }}
              onClose={this.handleCloseColorPicker}
            />
          )
        }
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
      colors: PropTypes.array
    })
  ),
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      cid: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ),
  colors: PropTypes.array,
  children: PropTypes.node,
  onAnnotate: PropTypes.func.isRequired,
  onAddAnnotationColor: PropTypes.func,
  onRemoveAnnotationColor: PropTypes.func
}
