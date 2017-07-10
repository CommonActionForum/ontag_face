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
import styled from 'styled-components'

const UnstyledContainer = ({ className, children, style }) => (
  <div
    className={`tooltip tooltip-bottom ${className}`}
    style={style}
  >
    {children}
  </div>
)

const UnstyledItem = ({ className, code, onClick }) => (
  <button
    className={className}
    onClick={onClick}
    style={{background: code}}
  />
)

const Container = styled(UnstyledContainer)`
  opacity: 1;
  position: fixed;
  transform: translateX(-50%);
`

const ListItem = styled(UnstyledItem)`
  width: 28px;
  height: 28px;
  margin: 4px 4px;
  border: none;
  box-shadow: inset 0 0 2px 0px rgba(0, 0, 0, 0.5);
  border-radius: 100%;
`

export default function ColorPicker ({ list, onSelect, position }) {
  return (
    <Container
      style={{
        top: (position.top + position.height) + 'px',
        left: (position.left + position.width / 2) + 'px'
      }}
    >
      <div className="tooltip-arrow"></div>
      <div className='tooltip-inner'>
        {
          list.map(({code, title}) => (
            <ListItem key={code} code={code} onClick={onSelect}>
              {title}
            </ListItem>
          ))
        }
      </div>
    </Container>
  )
}

ColorPicker.propTypes = {
  colours: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ),
  onSelect: PropTypes.func.isRequired
}
