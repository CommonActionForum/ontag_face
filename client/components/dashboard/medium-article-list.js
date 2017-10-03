import React from 'react'
import fetch from 'isomorphic-fetch'
import MediumArticle from './medium-article'

export default class MediumArticleList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      articles: []
    }
  }

  componentDidMount () {
    fetch(`/get-medium-posts?user_id=${window.__MEDIUM_ID__}`)
      .then(response => response.json())
      .then(articles => {
        this.setState({
          articles: articles
            .map(({title, uri, image}) => ({
              checked: false,
              title,
              uri,
              image
            }))
        })
      })
  }

  handleClick (i) {
    this.setState(prevState => {
      const oldArticles = prevState.articles

      return {
        articles: oldArticles.map(
          (article, j) => (
            i === j
            ? Object.assign(article, {checked: !article.checked})
            : article
          )
        )
      }
    })
  }

  render () {
    return (
      <div className='row'>
        {
          this.state.articles.map(
            ({title, uri, image, checked}, i) => (
              <MediumArticle
                key={i}
                title={title}
                uri={uri}
                image={image}
                checked={checked}
                onClick={() => this.handleClick(i)}
              />
            )
          )
        }
      </div>
    )
  }
}
