import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import ArticleContainer from '../client/components/annotators/article-container'

storiesOf('ArticleContainer', module)
  .add('basic usage', () => {
    const ff1 = [
      {
        prefix: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quam sapien, interdum vitae mi eget, lobortis faucibus arcu. Nulla cursus urna eget sem posuere interdum. Sed maximus, lectus at lobortis ornare, risus magna rutrum mi, quis ultrices quam odio ac nulla. Integer sit amet sapien turpis. Cras enim est, porta quis mollis quis, pulvinar quis erat. Etiam accumsan ipsum ipsum, a aliquam quam fermentum et. ',
        exact: 'Praesent facilisis, augue',
        suffix: ' in hendrerit porttitor, arcu nisl iaculis leo, nec porttitor erat nibh sit amet velit. Morbi cursus diam eget bibendum placerat. Nulla finibus, arcu in tincidunt vulputate, tellus lorem ultrices ipsum, nec accumsan risus ante vel arcu. Donec diam tortor, efficitur vitae ipsum sollicitudin, tincidunt pharetra tellus. Mauris accumsan scelerisque metus, at volutpat est placerat eget. Nullam viverra leo tincidunt libero imperdiet porttitor. Morbi tincidunt at mi id rhoncus.'
      },
      {
        prefix: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quam sapien, interdum vitae mi eget, lobortis faucibus arcu. ',
        exact: 'Nulla cursus urna',
        suffix: ' eget sem posuere interdum. Sed maximus, lectus at lobortis ornare, risus magna rutrum mi, quis ultrices quam odio ac nulla. Integer sit amet sapien turpis. Cras enim est, porta quis mollis quis, pulvinar quis erat. Etiam accumsan ipsum ipsum, a aliquam quam fermentum et. Praesent facilisis, augue in hendrerit porttitor, arcu nisl iaculis leo, nec porttitor erat nibh sit amet velit. Morbi cursus diam eget bibendum placerat. Nulla finibus, arcu in tincidunt vulputate, tellus lorem ultrices ipsum, nec accumsan risus ante vel arcu. Donec diam tortor, efficitur vitae ipsum sollicitudin, tincidunt pharetra tellus. Mauris accumsan scelerisque metus, at volutpat est placerat eget. Nullam viverra leo tincidunt libero imperdiet porttitor. Morbi tincidunt at mi id rhoncus.'
      },
      {
        prefix: 'Duis ut dolor eu dolor consectetur cursus. Etiam in enim sem. Mauris bibendum libero porta, eleifend justo quis, iaculis lacus. Aenean elementum eros eu mi tristique aliquam. Quisque pulvinar ligula magna, sit amet maximus lectus posuere non. Nulla ut lorem quis sapien imperdiet interdum. ',
        exact: 'Sed id diam',
        suffix: ' at orci condimentum fermentum in eget risus. Integer vitae nunc tellus. Mauris ut cursus neque.'
      }
    ]

    const body = {
      name: 'div',
      attrs: {},
      children: [
        {
          name: 'p',
          attrs: {},
          children: [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quam sapien, interdum vitae mi eget, lobortis faucibus arcu. Nulla cursus urna eget sem posuere interdum. Sed maximus, lectus at lobortis ornare, risus magna rutrum mi, quis ultrices quam odio ac nulla. Integer sit amet sapien turpis. Cras enim est, porta quis mollis quis, pulvinar quis erat. Etiam accumsan ipsum ipsum, a aliquam quam fermentum et. Praesent facilisis, augue in hendrerit porttitor, arcu nisl iaculis leo, nec porttitor erat nibh sit amet velit. Morbi cursus diam eget bibendum placerat. Nulla finibus, arcu in tincidunt vulputate, tellus lorem ultrices ipsum, nec accumsan risus ante vel arcu. Donec diam tortor, efficitur vitae ipsum sollicitudin, tincidunt pharetra tellus. Mauris accumsan scelerisque metus, at volutpat est placerat eget. Nullam viverra leo tincidunt libero imperdiet porttitor. Morbi tincidunt at mi id rhoncus.'
          ]
        },
        {
          name: 'p',
          attrs: {},
          children: [
            'Duis ut dolor eu dolor consectetur cursus. Etiam in enim sem. Mauris bibendum libero porta, eleifend justo quis, iaculis lacus. Aenean elementum eros eu mi tristique aliquam. Quisque pulvinar ligula magna, sit amet maximus lectus posuere non. Nulla ut lorem quis sapien imperdiet interdum. Sed id diam at orci condimentum fermentum in eget risus. Integer vitae nunc tellus. Mauris ut cursus neque.'
          ]
        },
        {
          name: 'p',
          attrs: {},
          children: [
            'raesent sagittis felis urna, vitae interdum quam elementum tincidunt. Suspendisse nec diam sodales, sollicitudin lectus at, euismod ipsum. Vestibulum blandit lacus erat, feugiat hendrerit magna rutrum a. Fusce et enim vitae enim rutrum varius non in dolor. Etiam a augue nec lorem fringilla tincidunt sed sit amet lorem. Nam sit amet malesuada risus. Duis et porta lectus. Suspendisse posuere venenatis eros, vitae malesuada tortor volutpat ut. Ut vitae viverra erat. Phasellus libero velit, vehicula sit amet faucibus sit amet, condimentum a elit. Ut id dictum nulla. Sed a tempus quam, quis rutrum mi.'
          ]
        },
        {
          name: 'p',
          attrs: {},
          children: [
            'Pellentesque posuere ultrices rutrum. Sed pulvinar augue nec sem maximus, a tempus nibh luctus. Aenean congue massa non enim faucibus, vel malesuada augue cursus. Donec nec convallis est. Duis posuere odio sit amet metus ornare lobortis nec id odio. Suspendisse blandit mauris vulputate nisl euismod pharetra. Duis a nibh id nisl viverra dictum. Morbi sodales quam felis, tincidunt elementum eros pretium vel. Nunc sit amet velit ac urna venenatis sagittis. Duis eu faucibus ex, eu congue tellus. In hac habitasse platea dictumst.'
          ]
        },
        {
          name: 'p',
          attrs: {},
          children: [
            'Duis magna metus, efficitur placerat orci a, imperdiet vestibulum neque. Curabitur a nisi at nulla gravida faucibus vitae accumsan sem. Curabitur vel eros consequat, ultricies sapien nec, molestie nibh. Ut laoreet quis ligula egestas consectetur. Fusce maximus dapibus dolor vitae tempor. Aenean id magna velit. Fusce diam orci, vehicula et sapien non, aliquet sodales leo. Cras ut nunc ac nisl feugiat maximus a nec magna. Proin ac sodales dui. Sed efficitur consequat sapien, vitae tincidunt ligula eleifend nec. Aenean lobortis id lorem nec condimentum. Nunc nec luctus nunc. Aliquam erat volutpat.'
          ]
        }
      ] // children
    }

    const tags = [
      { ref: 't1', title: 'Tag 1' },
      { ref: 't2', title: 'Tag 2' },
      { ref: 't3', title: 'Tag 3' }
    ]

    return (
      <ArticleContainer
        body={body}
        annotations={ff1}
        tags={tags}
        onAnnotate={action('annotate')}
      />
    )
  })
