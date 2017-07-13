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
      nodes: this.props.annotations.map(() => ({x: 0, y: 0, colours: []})),
      selectedAnnotation: null,
      selectedNode: -1
    }

    this.handleChangeColour = this.handleChangeColour.bind(this)
    this.handleSelectAnnotation = this.handleSelectAnnotation.bind(this)
    this.handleCloseColorPicker = this.handleCloseColorPicker.bind(this)
    this.annotations = this.getCallbacks(this.props.annotations)
  }

  componentWillReceiveProps (nextProps) {
    this.annotations = this.getCallbacks(nextProps.annotations)
  }

  handleSelectAnnotation (annotation, i) {
    this.setState({
      selectedAnnotation: annotation,
      selectedNode: i
    })
  }

  handleChangeColour (colorCode) {
    if (this.state.selectedAnnotation.colours.indexOf(colorCode) !== -1) {
      console.log('remove', colorCode)
      this.props.onRemoveAnnotationColour(this.state.selectedAnnotation.cid, colorCode)
    } else {
      console.log('add', colorCode)
      this.props.onAddAnnotationColour(this.state.selectedAnnotation.cid, colorCode)
    }
  }

  handleCloseColorPicker () {
    this.setState({
      selectedAnnotation: null,
      selectedNode: -1
    })
  }

  getCallbacks (annotations) {
    let counter = 0
    const nodes = []

    return annotations.map(
      (a, i) => ({
        fragment: a.fragment,
        colours: a.colours,
        colour: (a.colours || [''])[0],
        nodeRef: (node) => {
          if (node === null) {
            return
          }

          counter++
          const {top, left} = node.getBoundingClientRect()
          nodes[i] = {
            y: top + window.scrollY,
            x: left + window.scrollX,
            colours: a.colours
          }

          if (counter === nodes.length) {
            this.setState({nodes})
          }
        },
        onSelect: () => {
          this.handleSelectAnnotation(a, i)
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

    const filterByColour = colour => node => node.colours.indexOf(colour) !== -1
    const paths = (this.props.colours || [])
      .map(
        colour => ({
          colour,
          nodes: this
            .state.nodes
            .filter(filterByColour(colour))
            .map(
              ({x, y}) => ({
                x: x - container.left,
                y: y - container.top
              })
            )
        })
      )
      .filter(
        path => path.nodes.length > 0
      )

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
          this.state.selectedAnnotation && (
            <ColorPicker
              list={this.props.colours.map(
                  c => ({
                    code: c,
                    title: '',
                    selected: this.state.selectedAnnotation.colours.indexOf(c) !== -1
                  })
                )}
              onSelect={this.handleChangeColour}
              position={this.state.nodes[this.state.selectedNode]}
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
      colours: PropTypes.array
    })
  ),
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      cid: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ),
  colours: PropTypes.array,
  children: PropTypes.node,
  onAnnotate: PropTypes.func.isRequired,
  onAddAnnotationColour: PropTypes.func,
  onRemoveAnnotationColour: PropTypes.func
}
