import { configure } from '@storybook/react'

function loadStories () {
  require('../stories/liqen-is-a-graph.js')
  require('../stories/article-with-lines.js')
}

configure(loadStories, module)
