import { configure } from '@storybook/react'

function loadStories () {
  require('../stories/index.js')
  require('../stories/selection-x.js')
  require('../stories/text-annotator.js')
  require('../stories/article.js')
  require('../stories/article-container.js')
  require('../stories/color-picker.js')
  require('../stories/liqen-line.js')
}

configure(loadStories, module)
