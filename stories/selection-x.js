import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import SelectionMarker from '../client/components/annotators/text-annotator/selection-marker'
import SelectionHandler from '../client/components/annotators/text-annotator/selection-handler'
import SelectionMultiMarker from '../client/components/annotators/text-annotator/selection-multi-marker'

storiesOf('SelectionMarker', module)
  .add('Normal behaviour', () => (
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

storiesOf('SelectionHandler', module)
  .add('Normal behaviour', () => (
    <SelectionHandler onSelect={action('select')}>
      This is a text that can be selected
    </SelectionHandler>
  ))

storiesOf('SelectionMultimarker', module)
  .add('plain text with 1 fragment', () => {
    const frg = [
      {
        prefix: 'Hola ',
        exact: 'multi',
        suffix: 'mundo',
        ref: action('ref 1.1')
      }
    ]
    return (
      <SelectionMultiMarker fragments={frg}>
        Hola multimundo
      </SelectionMultiMarker>
    )
  })
  .add('plain text with 1+ fragments', () => {
    const frg = [
      {
        prefix: 'Hola ',
        exact: 'multi',
        suffix: 'mundo',
        ref: action('ref 2.1')
      },
      {
        prefix: '',
        exact: 'Hola',
        suffix: ' multimundo',
        ref: action('ref 2.2')
      },
      {
        prefix: 'Hola multi',
        exact: 'mundo',
        suffix: '',
        ref: action('ref 2.3')
      }
    ]
    return (
      <SelectionMultiMarker fragments={frg}>
        Hola multimundo
      </SelectionMultiMarker>
    )
  })
  .add('node with 1 fragment', () => {
    const frg = [
      {
        prefix: 'Hola ',
        exact: 'multi',
        suffix: 'mundo',
        ref: action('ref 3.1')
      }
    ]
    return (
      <SelectionMultiMarker fragments={frg}>
        <p>Hola multimundo</p>
      </SelectionMultiMarker>
    )
  })
  .add('array with 1 fragment', () => {
    const frg = [
      {
        prefix: 'Hola ',
        exact: 'multi',
        suffix: 'mundo',
        ref: action('ref 4.1')
      }
    ]
    return (
      <SelectionMultiMarker fragments={frg}>
        <p>Hola <strong>mul</strong>timundo</p>
      </SelectionMultiMarker>
    )
  })
  .add('array with 1+ fragment', () => {
    const frg = [
      {
        prefix: 'Hola ',
        exact: 'multi',
        suffix: 'mundo',
        ref: console.log
      },
      {
        prefix: '',
        exact: 'Hola',
        suffix: ' multimundo',
        ref: console.log
      },
      {
        prefix: 'Hola multi',
        exact: 'mundo',
        suffix: '',
        ref: console.log
      },
      {
        prefix: 'inexistent',
        exact: 'inexistent',
        suffix: 'inexistent',
        ref: console.log
      }
    ]

    return (
      <SelectionMultiMarker fragments={frg}>
        <p>Hola <strong>mul</strong>timundo</p>
      </SelectionMultiMarker>
    )
  })
