import React from 'react'
import { connect } from 'react-redux'
import fetch from 'isomorphic-fetch'

import Article from '../components/annotators/article-container'
import LiqenLine from '../components/lists/liqen-line'
import { createAnnotation,
         addAnnotationColour,
         removeAnnotationColour } from '../actions/index'

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
      colours,
      tags,
      onCreateAnnotation,
      onAddAnnotationColour,
      onRemoveAnnotationColour
    } = this.props

    return (
      <div>
        <aside className='night-panel'>
          <h2 className='h6 text-uppercase'>Question</h2>
          <p>{question}</p>
          <h2 className='h6 text-uppercase'>Liqens</h2>
          {
            liqens.map(liqen => (
              <LiqenLine answer={liqen.answer} colour={liqen.colour} />
            ))
          }
        </aside>
        <div className='article-positioner'>
          <div className='article-container'>
            <header>
              <h1 className="article-title">{article.title}</h1>
            </header>
            <main className='article-body'>
              <Article
                colours={colours}
                annotations={annotations.map(a => Object.assign({}, a, {fragment: a.target}))}
                body={this.state.articleBody}
                tags={tags}
                onAnnotate={onCreateAnnotation}
                onAddAnnotationColour={onAddAnnotationColour}
                onRemoveAnnotationColour={onRemoveAnnotationColour}
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
  const colours = []

  // Colored annotations
  for (let colour in state.colours) {
    colours.push(colour)
  }

  // Not colored annotations
  for (let cid in state.annotations) {
    const {tag, checked, pending, target} = state.annotations[cid]

    ret.push({
      tag: state.tags[tag].title,
      colours: colours
        .filter(colour => {
          const liqenRef = state.colours[colour]
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

  for (let colour in state.colours) {
    if (state.colours[colour]) {
      const liqen = state.liqens[state.colours[colour]]
      const answer = state.question.answer
        .map(qa => {
          const annotations = liqen.answer
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

      ret.push({
        colour,
        answer
      })
    }
  }

  return ret
}

const mapStateToColours = state => {
  const ret = []

  for (let cid in state.colours) {
    ret.push(cid)
  }

  return ret
}

const mapStateToProps = (state) => ({
  question: state.question.title,
  annotations: mapStateToAnnotations(state),
  liqens: mapStateToLiqens(state),
  colours: mapStateToColours(state),
  tags: state.question.answer.map(
    ({tag}) => ({ref: tag, title: state.tags[tag].title})
  )
})
const mapDispatchToProps = (dispatch) => ({
  onCreateAnnotation: ({target, tag}) => dispatch(createAnnotation(target, tag)),
  onAddAnnotationColour: (annotation, colour) =>
    dispatch(addAnnotationColour(annotation, colour)),
  onRemoveAnnotationColour: (annotation, colour) =>
    dispatch(removeAnnotationColour(annotation, colour))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Annotate)
