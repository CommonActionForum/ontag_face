import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import SelectionMarker from '../client/components/annotators/text-annotator/selection-marker'
import SelectionHandler from '../client/components/annotators/text-annotator/selection-handler'

storiesOf('Selection', module)
  .add('Marker', () => (
    <SelectionMarker
      fragment={{
        prefix: 'Hello ',
        exact: 'Button',
        suffix: ''
      }}
    >
      <p>Hello Button</p>
    </SelectionMarker>
  ))
  .add('Handler', () => (
    <SelectionHandler onSelect={action('select')}>
      This is a text that can be selected
    </SelectionHandler>
  ))
