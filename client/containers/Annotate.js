import React from 'react'
import { connect } from 'react-redux'
import fetch from 'isomorphic-fetch'
import styled from 'styled-components'
import Article from '../components/annotators/article-container'
import AnswersPanel from '../components/answers-panel'

import { createAnnotation,
         addAnnotationColor,
         removeAnswerAnnotation,
         deleteAnnotation } from '../actions/index'

const article = window.__ARTICLE__

const UnstyledToggler = ({className, onClick, direction}) => (
  <button className={className} onClick={onClick}>
    <i className={`fa fa-angle-${direction} fa-3x`} />
    { direction === 'right' &&
      <div>Show the answers to this question</div> }
    { direction === 'left' &&
      <div>Back to the article</div> }
  </button>
)

const Toggler = styled(UnstyledToggler)`
  max-width: 300px;
  text-align: center;
  display: block;
  margin: 1rem auto;
  color: #999 !important;
  font-size: 0.8rem;
  background: none;
  border: none;
`

export class Annotate extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      articleBody: {
        name: 'div',
        attrs: {},
        children: []
      },
      showArticle: true
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

  handleToggleDirection () {
    this.setState(prevState => ({
      articleBody: prevState.articleBody,
      showArticle: !prevState.showArticle
    }))
  }

  render () {
    const {
      annotations,
      tags,
      colors,
      onCreateAnnotation,
      onAddAnnotationColor,
      onRemoveAnnotationColor,
      onDeleteAnnotation,
      answers
    } = this.props

    return (
      <div>
        <div className='article-container'>
          <Toggler
            direction={this.state.showArticle ? 'right' : 'left'}
            onClick={() => this.handleToggleDirection()}
          />
          <div>
            {
              this.state.showArticle &&
              <main className='article-body'>
                <Article
                  colors={colors}
                  annotations={annotations}
                  body={this.state.articleBody}
                  tags={tags}
                  onAnnotate={onCreateAnnotation}
                  onAddAnnotationColor={onAddAnnotationColor}
                  onRemoveAnnotationColor={onRemoveAnnotationColor}
                  onDeleteAnnotation={onDeleteAnnotation}
                />
            </main>
            }
          </div>
          <div>
            {
              !this.state.showArticle &&
              <AnswersPanel
                answers={answers}
                tags={tags}
              />
            }
          </div>
        </div>
      </div>
    )
  }
}

function objectToArray (object) {
  const ret = []
  for (let i in object) {
    ret.push(Object.assign({}, object[i], {cid: i}))
  }

  return ret
}

const colors = [
  '#FFAB40',
  '#E91E63',
  '#E040FB',
  '#AA00FF',
  '#9FA8DA',
  '#2962FF',
  '#18FFFF',
  '#B2FF59',
  '#EEFF41'
]

const mapStateToAnnotations = (state) => {
  const coloredAnswers = objectToArray(state.answers)
    .map((ans, i) => ({
      annotations: ans.annotations,
      cid: ans.cid,
      color: i < colors.length ? colors[i] : null
    }))

  function getColors (annotation) {
    return coloredAnswers
      .filter(ans => ans.annotations.indexOf(annotation) !== -1)
      .map(a => a.color)
  }

  return objectToArray(state.annotations)
    .map(ann => ({
      cid: ann.cid,
      fragment: ann.target,
      colors: getColors(ann.cid)
    }))
}

const mapStateToColors = (state) => {
  return colors.slice(0, objectToArray(state.answers).length + 1)
}

const mapStateToTags = (state) => {
  const tags = state.question.required_tags.concat(state.question.optional_tags)

  return tags.map(tagCid => ({
    title: state.tags[tagCid].title,
    id: state.tags[tagCid].id,
    cid: tagCid
  }))
}

const mapStateToAnswers = (state) => {
  return objectToArray(state.answers)
    .map(ans => ({
      id: ans.id,
      annotations: ans.annotations.map(a => state.annotations[a])
    }))
}

const mapStateToProps = (state) => ({
  question: state.question.title,
  annotations: mapStateToAnnotations(state),
  colors: mapStateToColors(state),
  tags: mapStateToTags(state),
  answers: mapStateToAnswers(state)
})

const mapDispatchToProps = (dispatch) => ({
  onCreateAnnotation: ({target, tag}) =>
    dispatch(createAnnotation(target, tag)),
  onAddAnnotationColor: (annotation, color) =>
    dispatch(addAnnotationColor(color, annotation, colors)),
  onRemoveAnnotationColor: (annotation, color) =>
    dispatch(removeAnswerAnnotation(color, annotation, colors)),
  onDeleteAnnotation: (cid) =>
    dispatch(deleteAnnotation(cid))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Annotate)
