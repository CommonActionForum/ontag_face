import React from 'react'
import Article from './article'
import core from '../../core'

class ArticleList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      articles: [
        {
          id: 0,
          title: 'Example article',
          source: {
            uri: 'http://localhost'
          }
        }
      ]
    }
  }

  componentWillMount () {
    core.entries.index()
        .then(articles => {
          this.setState({articles})
        })
        .catch(e => {
          console.log(e)
        })
  }

  render () {
    const articles = this.state.articles.map(article => {
      const {title, entry_type, id} = article

      if (entry_type === 'medium_post') {
        return (
          <Article
            questionId={1}
            key={id}
            id={id}
            title={title}
            uri={article.medium_post.uri}
            image={''} />
        )
      } else {

      }
    })

    return (
      <div className='container'>
        <div className='row'>
          {articles}
        </div>
      </div>
    )
  }
}

export default ArticleList
