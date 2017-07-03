import { configure } from '@storybook/react'

function loadStories () {
  require('../stories/liqen-is-a-graph.js')
}

configure(loadStories, module)
