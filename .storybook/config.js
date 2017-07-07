import { configure } from '@storybook/react'

function loadStories () {
  require('../stories/index.js')
  require('../stories/selection-x.js')
  require('../stories/article.js')
  require('../stories/article-container.js')
}

configure(loadStories, module)
