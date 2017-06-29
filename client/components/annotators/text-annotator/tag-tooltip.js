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

const Container = styled(UnstyledContainer)`
  opacity: 1;
  position: fixed;
  transform: translateX(-50%);
`

const List = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
`

const ListItem = styled.li`
  padding: 5px;
`

const Button = styled.button`
  color: #FFF;
  font-family: sans-serif;
  font-weight: bold;
  padding: 5px;
  background: none;
  border: 0;
  cursor: pointer;
  outline: none;
  text-align: left;
  width: 100%;
`

const Tooltip = ({ list, onSelect, position }) => (
  <Container
    style={{
      top: (position.top + position.height) + 'px',
      left: (position.left + position.width / 2) + 'px'
    }}
  >
    <div className="tooltip-arrow"></div>
    <div className='tooltip-inner'>
      <List>
        {
          list.map(({ref, title}) => (
            <ListItem key={ref}>
              <Button onClick={() => onSelect(ref)}>
                {title}
              </Button>
            </ListItem>
          ))
        }
      </List>
    </div>
  </Container>
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
