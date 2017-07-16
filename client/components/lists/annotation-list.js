import React from 'react'
import PropTypes from 'prop-types'
import AnnotationItem from './annotation-item'

export default function Selector ({ annotations, onSelect }) {
  return (
    <div className='list-group list-group-flush'>
      {
        annotations.length > 0 && annotations.map(annotation => (
          <div
            className='list-group-item'
            key={annotation.cid}
          >
            <AnnotationItem
              tag={annotation.tag}
              target={annotation.target}
              pending={annotation.pending}
              onSelect={() => onSelect(annotation)} />
          </div>
        ))
      }
      {
        annotations.length === 0 && (
          <div className='list-group-item'>
            Start highlighting and you will see the annotations here
          </div>
        )
      }
    </div>
  )
}

Selector.propTypes = {
  annotations: PropTypes.arrayOf(
    PropTypes.shape({
      cid: PropTypes.string.isRequired,
      checked: PropTypes.bool,
      tag: PropTypes.string.isRequired,
      target: PropTypes.shape({
        prefix: PropTypes.string.isRequired,
        exact: PropTypes.string.isRequired,
        suffix: PropTypes.string.isRequired
      }),
      pending: PropTypes.bool,
      onSelect: PropTypes.func
    })
  )
}
