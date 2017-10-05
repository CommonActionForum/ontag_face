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
  // Copy of all the annotations
  const ret = []
  const colors = []

  // Colored annotations
  for (let color in state.colors) {
    colors.push(color)
  }

  // Not colored annotations
  for (let cid in state.annotations) {
    const {tag, checked, pending, target} = state.annotations[cid]

    ret.push({
      tag: state.tags[tag].title,
      colors: colors
        .filter(color => {
          const liqenRef = state.colors[color]
          return liqenRef && state.liqens[liqenRef].answer.indexOf(cid) !== -1
        }),
      target,
      cid,
      checked,
      pending
    })
  }

  return ret
}

const mapStateToLiqens = (state) => {
  const ret = []

  for (let color in state.colors) {
    if (state.colors[color]) {
      const liqen = state.liqens[state.colors[color]]
      const answer = state.question.answer
        .map(qa => {
          const annotations = liqen.answer
            .filter(la =>
              state.annotations[la]
            )
            .filter(la =>
              state.annotations[la].tag === qa.tag
            )
            .map(annotation =>
              Object.assign(
                {},
                state.annotations[annotation],
                {ref: annotation}
              )
            )

          return {
            tag: state.tags[qa.tag],
            annotations
          }
        })

      const sum = answer.reduce((acc, a) => acc + a.annotations.length, 0)

      if (sum > 0) {
        ret.push({
          color,
          answer
        })
      }
    }
  }

  return ret
}

const mapStateToColors = state => {
  const ret = []

  for (let cid in state.colors) {
    ret.push(cid)
  }

  return ret
}

const mapStateToProps = (state) => ({
  question: state.question.title,
  annotations: mapStateToAnnotations(state),
  liqens: mapStateToLiqens(state),
  colors: mapStateToColors(state),
  tags: []
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
