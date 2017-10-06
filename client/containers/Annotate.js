import React from 'react'
import { connect } from 'react-redux'
import fetch from 'isomorphic-fetch'
import styled from 'styled-components'

import Article from '../components/annotators/article-container'
import { createAnnotation,
         addAnnotationColor,
         removeAnnotationColor } from '../actions/index'

const article = window.__ARTICLE__

const UnstyledToggler = ({className, onClick}) => (
  <a className={className} onClick={onClick}>
    <i className='fa fa-angle-right fa-3x' />
    <div>Show the answers to this question</div>
  </a>
)

const Toggler = styled(UnstyledToggler)`
  max-width: 300px;
  text-align: center;
  display: block;
  margin: 1rem auto;
  color: #999 !important;
  font-size: 0.8rem;
`

export class Annotate extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      articleBody: {
        name: 'div',
        attrs: {},
        children: []
      }
    }
  }

  componentDidMount () {
    const uri = article.entry_type === 'medium_post' ? article.medium_post.uri : ''

    fetch(`/parse-article?uri=${uri}`)
      .then(response => response.json())
      .then(obj => {
        this.setState({articleBody: obj.body.object})
      })
  }

  render () {
    const {
      annotations,
      tags,
      colors,
      onCreateAnnotation,
      onAddAnnotationColor,
      onRemoveAnnotationColor
    } = this.props

    return (
      <div>
        <div className='article-container'>
          <Toggler />
          <main className='article-body'>
            <Article
              colors={colors}
              annotations={annotations.map(a => Object.assign({}, a, {fragment: a.target}))}
              body={this.state.articleBody}
              tags={tags}
              onAnnotate={onCreateAnnotation}
              onAddAnnotationColor={onAddAnnotationColor}
              onRemoveAnnotationColor={onRemoveAnnotationColor}
            />
          </main>
        </div>
      </div>
    )
  }
}

const mapStateToAnnotations = (state) => {
  return []
}

const mapStateToAnswers = (state) => {
  return []
}

const mapStateToColors = (state) => {
  return []
}

const mapStateToTags = (state) => {
  return []
}

const mapStateToProps = (state) => ({
  question: state.question.title,
  annotations: mapStateToAnnotations(state),
  liqens: mapStateToAnswers(state),
  colors: mapStateToColors(state),
  tags: mapStateToTags(state)
})

const mapDispatchToProps = (dispatch) => ({
  onCreateAnnotation: ({target, tag}) => dispatch(createAnnotation(target, tag)),
  onAddAnnotationColor: (annotation, color) =>
    dispatch(addAnnotationColor(annotation, color)),
  onRemoveAnnotationColor: (annotation, color) =>
    dispatch(removeAnnotationColor(annotation, color))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Annotate)
