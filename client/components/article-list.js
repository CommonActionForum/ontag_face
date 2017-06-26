import React from 'react'
import Article from './article'
import liqen from 'liqen'
import fakeLiqen from '../../server/local-liqen'
import cookies from 'cookies-js'

const token = cookies.get('access_token')
const options = {
  apiURI: process.env.LIQEN_API_URI
}

let core = liqen(token, options)

if (process.env.NODE_ENV === 'development') {
  core = fakeLiqen(token, options)
}

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
    core.articles.index()
        .then(articles => {
          console.log(articles); this.setState({articles})
        })
        .catch(e => {
          console.log(e)
        })
  }

  render () {
    const articles = this.state.articles.map(({id, title, source}) =>
      <Article key={id}
        id={id}
        title={title}
        link={`/annotate?question=1&article=${id}`} />
    )

    return (
      <div>
        {articles}
      </div>
    )
  }
}

export default ArticleList
