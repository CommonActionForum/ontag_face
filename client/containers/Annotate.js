import React from 'react'
import { connect } from 'react-redux'
import fetch from 'isomorphic-fetch'

import Article from '../components/annotators/article-container'
import MultiList from '../components/lists/multi-list'
import { createAnnotation } from '../actions/index'

const article = window.__ARTICLE__
const COLOURS = [
  'green', 'orange', 'purple', 'gold', 'pink', 'blue'
]

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
      tags,
      onCreateAnnotation
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
              annotations={annotations.map(a => Object.assign({}, a, {fragment: a.target}))}
              body={this.state.articleBody}
              tags={tags}
              onAnnotate={onCreateAnnotation}
            />
          </main>
        </div>
      </div>
    )
  }
}

const mapStateToAnnotations = (state) => {
  const ret = []
  const liqens = []

  for (let ref in state.liqens) {
    liqens.push({
      answer: state.liqens[ref].answer,
      colour: COLOURS[liqens.length]
    })
  }

  for (let ref in state.annotations) {
    const {tag, checked, pending, target} = state.annotations[ref]
    const arr = liqens
      .filter(l => l.answer.indexOf(ref) !== -1)

    const colour = arr
      .length === 0 ? 'gray' : arr[0].colour

    ret.push({
      tag: state.tags[tag].title,
      colour,
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

const mapStateToProps = (state) => ({
  question: state.question.title,
  annotations: mapStateToAnnotations(state),
  liqens: mapStateToLiqens(state),
  tags: state.question.answer.map(
    ({tag}) => ({ref: tag, title: state.tags[tag].title})
  )
})
const mapDispatchToProps = (dispatch) => ({
  onCreateAnnotation: ({target, tag}) => dispatch(createAnnotation(target, tag))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Annotate)
