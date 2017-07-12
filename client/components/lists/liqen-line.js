import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Line = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
  display: flex;
`

const PartialLineContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  width: 100%;
  height: 24px;
  z-index: -1;
`

const AuxBall = styled.div`
  width: 12px;
  flex: 0 0 auto;
`

const AuxNotball = styled.div`
  width: 1px;
  flex: 1 1 auto;
`

const Aux = ({className, style}) => (
  <div className={className}>
    <AuxBall />
    <AuxNotball style={style} />
  </div>
)

const PartialLine = styled(Aux)`
  display: flex;
  flex-direction: ${props => props.side === 'left' ? 'row-reverse' : 'row'};
  height: 3px;
  width: 50%;
`

const Label = styled.div`
  text-align: center;
  font-size: 12px;
`

const UnstyledDotContainer = (props) => {
  const {className, style, colour, number, children, first, last} = props

  return (
    <li className={className} style={style}>
      <PartialLineContainer>
        <PartialLine
          side='left'
          style={{
            backgroundColor: colour,
            visibility: first ? 'hidden' : 'visible'
          }}
        />
        <PartialLine
          side='right'
          style={{
            backgroundColor: colour,
            visibility: last ? 'hidden' : 'visible'
          }}
        />
      </PartialLineContainer>
      <Dot style={{
        borderColor: colour,
        color: colour,
        boxShadow: `0 0 1px 0px ${colour},
                    0 0 1px 0px ${colour} inset`
      }}>
        {number}
      </Dot>
      <Label>
        {children}
      </Label>
    </li>
  )
}

const Dot = styled.div`
  margin: 0 auto;
  font-size: 14px;
  font-weight: bold;
  width: 24px;
  height: 24px;
  padding: 0px 0;
  border-width: 2px;
  border-style: solid;
  border-radius: 100%;
  text-align: center;
`

const DotContainer = styled(UnstyledDotContainer)`
  flex: 1 1 1px;
  position: relative;
`

export default function LiqenLine ({answer, colour}) {
  return (
    <Line>
      {
        answer.map((ans, i) => (
          <DotContainer
            colour={colour}
            first={i === 0}
            last={i === answer.length - 1}
            number={ans.annotations.length}
          >
            {ans.tag.title}
          </DotContainer>
        ))
      }
    </Line>
  )
}

LiqenLine.propTypes = {
  answer: PropTypes.arrayOf(
    PropTypes.shape({
      tag: PropTypes.shape({
        title: PropTypes.string.isRequired
      }),
      annotations: PropTypes.arrayOf(
        PropTypes.shape({
          target: PropTypes.shape({
            exact: PropTypes.string.isRequired
          }).isRequired
        }).isRequired
      ).isRequired
    }).isRequired
  ).isRequired,
  colour: PropTypes.string.isRequired
}
