import React from 'react'
import { storiesOf } from '@storybook/react'
// import { action } from '@storybook/addon-actions'

import LiqenLine from '../client/components/lists/liqen-line'

storiesOf('Liqen Line', module)
  .add('basic usage', () => (
    <LiqenLine
      answer={[
        {
          tag: {
            title: 'Tag 1'
          },
          annotations: [
            {
              target: {
                prefix: 'hola ',
                exact: 'multi',
                suffix: 'mundo'
              }
            }
          ]
        },
        {
          tag: {
            title: 'Tag 2'
          },
          annotations: [
            {
              target: {
                prefix: 'hola ',
                exact: 'multi',
                suffix: 'mundo'
              }
            },
            {
              target: {
                prefix: 'hola ',
                exact: 'multi2',
                suffix: 'mundo'
              }
            }
          ]
        },
        {
          tag: {
            title: 'Tag 2'
          },
          annotations: []
        }
      ]}
      color='#ffab40'
    />
  ))
