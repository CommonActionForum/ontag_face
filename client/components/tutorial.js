import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgb(0,0,0);
  color: rgb(255,255,255);
  padding-top: 2rem;
  padding-bottom: 2rem;
`

const Title = styled.h2`
`

const Step = styled.div`
  display: ${props => props.active ? 'flex' : 'none'};
  align-items: center;
`

const StepLeft = styled.div`
  flex: 1 0 auto;
`

const StepContent = styled.div`
  display: flex;
`

const StepTitle = styled.h3`
  width: 2rem;
`

const StepText = styled.div`
`

const StepImage = styled.div`
  width: 10rem;
  height: 10rem;
  border-radius: 100%;
  background-size: contain;
  margin: 0 1rem;
  flex: 0 0 auto;
`

const Arrow = styled.i`
  flex: 0 0 auto;
  margin: 0 2rem;
`

export default class Tutorial extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      step: 1
    }

    this.handleChangeStep = this.handleChangeStep.bind(this)
  }

  handleChangeStep (step) {
    this.setState({
      step
    })
  }

  render () {
    return (
      <Container>
        <Step active={this.state.step === 1} className='container'>
          <StepLeft>
            <Title>How to answer the question in two steps</Title>
            <StepContent>
              <StepTitle>1</StepTitle>
              <StepText>
                <p>This question has three tags: <strong>Place of origin</strong>, <strong>Reason</strong> and <strong>Destination</strong>.</p>
                <p>Highlight the parts of the text that fit with those and tag them to create <strong>annotations</strong></p>
              </StepText>
            </StepContent>
          </StepLeft>
          <StepImage style={{ backgroundImage: 'url(/static/gifs/create-annotation.gif)' }} />
          <Arrow
            className={`fa fa-angle-right fa-3x`}
            onClick={() => this.handleChangeStep(2)} />
        </Step>

        <Step active={this.state.step === 2} className='container'>
          <Arrow
            className={`fa fa-angle-left fa-3x`}
            onClick={() => this.handleChangeStep(1)} />
          <StepLeft>
            <Title>How to answer the question in two steps</Title>
            <StepContent>
              <StepTitle>2</StepTitle>
              <StepText>
                <p>Colorize annotations to join them. The annotations with the same colour will form a single answer</p>
              </StepText>
            </StepContent>
          </StepLeft>
          <StepImage style={{ backgroundImage: 'url(/static/gifs/create-annotation.gif)' }} />
        </Step>
      </Container>
    )
  }
}
