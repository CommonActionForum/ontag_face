import React from 'react'
import Article from './article'
import core from '../../core'

console.log(core)

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
          console.log(articles); this.setState({articles})
        })
        .catch(e => {
          console.log(e)
        })
  }

  render () {
    const articles = this.state.articles.map(({title, uri, image, id}) =>
      <Article
        key={id}
        title={title}
        uri={uri}
        image={image} />
    )

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
