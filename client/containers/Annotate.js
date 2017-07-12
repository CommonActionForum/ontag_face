import React from 'react'
import { connect } from 'react-redux'
import fetch from 'isomorphic-fetch'

import Article from '../components/annotators/article-container'
import MultiList from '../components/lists/multi-list'
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
      annotations,
      liqens,
      colours,
      tags,
      onCreateAnnotation,
      onAddAnnotationColour,
      onRemoveAnnotationColour
    } = this.props

    return (
      <div className='row'>
        <aside className='hidden-md-down col-lg-4 flex-last'>
          <MultiList
            annotations={annotations}
            liqens={liqens}
          />
        </aside>
        <div className='col-lg-8 col-xl-7'>
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
  for (let ref in state.annotations) {
    const {tag, checked, pending, target} = state.annotations[ref]

    ret.push({
      tag: state.tags[tag].title,
      colours: colours
        .filter(colour => {
          const liqenRef = state.colours[colour]
          return liqenRef && state.liqens[liqenRef].answer.indexOf(ref) !== -1
        }),
      target,
      ref,
      checked,
      pending
    })
  }

  return ret
}

const mapStateToLiqens = (state) => {
  const ret = []

  for (let ref in state.liqens) {
    const {answer, pending} = state.liqens[ref]

    ret.push({
      answer: answer
        .map(a => {
          if (!state.annotations[a]) {
            return null
          }

          const {tag, target} = state.annotations[a]

          return {
            target,
            ref: a,
            tag: state.tags[tag]
          }
        })
        .filter(a => a !== null),
      ref,
      pending
    })
  }

  return ret
}

const mapStateToColours = state => {
  const ret = []

  for (let ref in state.colours) {
    ret.push(ref)
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
