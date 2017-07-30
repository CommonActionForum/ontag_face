import React from 'react'
import { connect } from 'react-redux'
import fetch from 'isomorphic-fetch'

import Article from '../components/annotators/article-container'
import LiqenLine from '../components/lists/liqen-line'
import { createAnnotation,
         addAnnotationColor,
         removeAnnotationColor } from '../actions/index'

const article = window.__ARTICLE__

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
    fetch(`/parseArticle?uri=${article.source.uri}`)
      .then(response => response.json())
      .then(obj => {
        this.setState({articleBody: obj.body.object})
      })
  }

  render () {
    const {
      question,
      annotations,
      liqens,
      colors,
      tags,
      onCreateAnnotation,
      onAddAnnotationColor,
      onRemoveAnnotationColor
    } = this.props

    return (
      <div>
        <aside className='night-panel'>
          {
            annotations.length > 0 && liqens.length === 0 && (
              <div className='text-center'>
                <div className='h6 text-uppercase'>Step 2</div>
                <div>Join annotations to create liqens (answers)</div>
                <div
                  className='rounded-circle d-block my-3 mx-auto'
                  style={{
                    background: 'url(/static/gifs/create-liqen.gif)',
                    backgroundSize: 'contain',
                    width: '160px',
                    height: '160px'
                  }}
                />
              </div>
            )
          }
          {
            annotations.length === 0 && liqens.length === 0 && (
              <div className='text-center'>
                <div className='h6'>Step 1</div>
                <div>Create annotations in the text</div>
                <div
                  className='rounded-circle d-block my-3 mx-auto'
                  style={{
                    background: 'url(/static/gifs/create-annotation.gif)',
                    backgroundSize: 'contain',
                    width: '160px',
                    height: '160px'
                  }}
                />
              </div>
            )
          }
          <h2 className='h6 text-uppercase'>Question</h2>
          <p>{question}</p>
          {
            liqens.length > 0 &&
            <h2 className='h6 text-uppercase'>Liqens</h2>
          }
          <div>
            {
              liqens.map(liqen => (
                <LiqenLine key={liqen.ref} answer={liqen.answer} color={liqen.color} />
              ))
            }
          </div>
          {
            annotations.length > 0 &&
            <h2 className='h6 text-uppercase'>Annotations</h2>
          }
          <ul>
            {
              annotations.map(annotation => (
                <li>{annotation.target.exact}</li>
              ))
            }
          </ul>
        </aside>
        <div className='article-positioner'>
          <div className='article-container'>
            <header>
              <h1 className="article-title">{article.title}</h1>
            </header>
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
  tags: state.question.answer.map(
    ({tag}) => ({ref: tag, title: state.tags[tag].title})
  )
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
