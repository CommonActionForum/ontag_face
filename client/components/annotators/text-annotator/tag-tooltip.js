/**
 * Tooltip to select a tag
 *
 * Inputs
 * - tagList
 * - position
 * - visible
 *
 * Outputs
 * - onTag()
 */
import React from 'react'
import PropTypes from 'prop-types'

const Tooltip = ({ list, onSelect, position }) => (
  <div
    className='tooltip tooltip-bottom'
    style={{
      opacity: 1,
      position: 'fixed',
      top: (position.top + position.height) + 'px',
      left: (position.left + position.width / 2) + 'px',
      transform: 'translateX(-50%)'
    }}
  >
    <div className="tooltip-arrow"></div>
    <div className='tooltip-inner'>
      <ul
        style={{
          padding: 0,
          margin: 0,
          listStyle: 'none'
        }}
      >
        {
          list.map(({ref, title}) => (
            <li
              key={ref}
              style={{
                padding: '5px'
              }}
            >
              <button
                style={{
                  color: '#FFF',
                  fontFamily: 'sans-serif',
                  fontWeight: 'bold',
                  padding: '5px',
                  background: 'none',
                  border: 0,
                  cursor: 'pointer',
                  outline: 'none',
                  textAlign: 'left'
                }}
                onClick={() => onSelect(ref)}
              >
                {title}
              </button>
            </li>
          ))
        }
      </ul>
    </div>
  </div>
)

Tooltip.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      ref: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]).isRequired,
      title: PropTypes.string.isRequired
    })
  ),
  onSelect: PropTypes.func.isRequired
}

export default Tooltip
