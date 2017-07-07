import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import TextAnnotator from '../client/components/annotators/text-annotator/text-annotator'

storiesOf('TextAnnotator', module)
  .add('A normal usage', () => {
    const tags = [
      { ref: 't1', title: 'Tag 1' },
      { ref: 't2', title: 'Tag 2' },
      { ref: 't3', title: 'Tag 3' }
    ]

    return (
      <TextAnnotator
        tags={tags}
        onCreateAnnotation={action('create annotation')}
      >
        Hola multimundo
      </TextAnnotator>
    )
  })
