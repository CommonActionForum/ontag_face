import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import ColorPicker from '../client/components/annotators/color-picker'

storiesOf('ColorPicker', module)
  .add('8 colors', () => {
    const list = [
      {
        code: '#FFAB40',
        title: 'Orange A200',
        selected: true
      },
      {
        code: '#E91E63',
        title: 'Pink 500'
      },
      {
        code: '#E040FB',
        title: 'Purple A200'
      },
      {
        code: '#AA00FF',
        title: 'Purple A700',
        selected: true
      },
      {
        code: '#9FA8DA',
        title: 'Indigo 200'
      },
      {
        code: '#2962FF',
        title: 'Blue A700',
        selected: true
      },
      {
        code: '#18FFFF',
        title: 'Cyan A200'
      },
      {
        code: '#B2FF59',
        title: 'Light Green A200'
      },
      {
        code: '#EEFF41',
        title: 'Lime A200'
      },
      {
        code: '#FFFFFF',
        title: 'white'
      }
    ]

    return (
      <ColorPicker
        list={list}
        onSelect={action('select color')}
        position={{top: 0, left: 100, width: 0, height: 0}}
      />
    )
  })
