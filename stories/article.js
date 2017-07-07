import React from 'react'
import { storiesOf } from '@storybook/react'

import ArticleBackground from '../client/components/annotators/article-background'

storiesOf('ArticleBackground', module)
  .add('An array of paths and nodes', () => {
    const paths = [
      {
        nodes: [
          {x: 20, y: 30},
          {x: 30, y: 50},
          {x: 20, y: 70},
          {x: 50, y: 90},
          {x: 60, y: 100}
        ]
      },
      {
        nodes: [
          {x: 50, y: 50},
          {x: 80, y: 20},
          {x: 90, y: 100},
          {x: 100, y: 30},
          {x: 130, y: 40}
        ]
      }
    ]

    return (
      <ArticleBackground
        paths={paths}
        width={300}
        height={200}
      />
    )
  })
