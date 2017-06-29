import React from 'react'
import styled, { keyframes } from 'styled-components'
import PropTypes from 'prop-types'

const growing = keyframes`
  0% {
    transform: scaleX(0);
  }

  100% {
    transform: scaleX(1);
  }
`

const disappearing = keyframes`
  0% {
    transform: scaleX(0)
  }

  50% {
    transform: scaleX(1);
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`

const Bar = styled.div`
  height: 1px;
  position: absolute;
  background: #00CC00;
  transform-origin: left;
  width: 100%;
`

const FastBar = Bar.extend`
  animation: 1s ${disappearing} ease;
  animation-fill-mode: forwards;
`

const SlowBar = Bar.extend`
  animation: 30s ${growing} cubic-bezier(.07,.96,.07,.96);
`

export default class ProgressBar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      showSlow: !this.props.completed,
      showFast: false
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.completed && nextProps.completed) {
      this.setState({
        showFast: true
      })

      this.timerID = setTimeout(() => this.hideSlow(), 500)
    }
  }

  componentWillUnmount () {
    clearTimeout(this.timerID)
  }

  hideSlow () {
    this.setState({
      showSlow: false
    })
  }

  render () {
    return (
      <div style={{ position: 'absolute', width: '100%', height: '1px', bottom: '0', left: '0' }}>
        {this.state.showSlow && <SlowBar></SlowBar>}
        {this.state.showFast && <FastBar></FastBar>}
      </div>
    )
  }
}

ProgressBar.propTypes = {
  completed: PropTypes.bool
}
