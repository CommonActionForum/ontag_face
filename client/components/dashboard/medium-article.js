import React from 'react'
import styled from 'styled-components'

const UnstyledContainer = ({ className, children }) => (
  <div className={`col-12 col-md-6 col-lg-4 ${className}`}>
    {children}
  </div>
)

const Container = styled(UnstyledContainer)`
  margin-bottom: 1rem;
`

const Border = styled.div`
  border: ${props => props.checked ? '3px solid #0c0' : '3px solid #999'};
  padding: 0.5rem;
  height: 13em;
  position: relative;
  opacity: ${props => props.checked ? '1' : '0.75'};
`

const UnstyledImage = ({ className, children, image }) => (
  <div className={className}
    style={{backgroundImage: `url(${image})`}}
  />
)

const HeaderImage = styled(UnstyledImage)`
  display: block;
  background-size: cover;
  height: 5rem;
`

const Title = styled.h2`
  padding: 1rem 0 0 0;
  font-size: 1.25rem;
`

const Text = styled.div`
  padding: 0.5rem 0;
  font-size: 0.8rem;
  color: #666;
`

const Circle = styled.div`
  background-color: ${props => props.checked ? '#0c0' : '#fff'};
  color: #fff;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 100%;
  position: absolute;
  top: 1rem;
  right: 1rem;
  text-align: center;
  cursor: pointer;
`

const MediumArticle = ({ title, uri, image, checked, onClick }) => (
  <Container>
    <Border checked={checked} onClick={onClick}>
      <input
        type='checkbox'
        name='uri'
        value={uri}
        style={{display: 'none'}}
        checked={checked}
        readOnly
      />
      <input
        type='checkbox'
        name='title'
        value={title}
        style={{display: 'none'}}
        checked={checked}
        readOnly
      />
      <input
        type='checkbox'
        name='image'
        value={image}
        style={{display: 'none'}}
        checked={checked}
        readOnly
      />
      <HeaderImage image={image} />
      <Title>{title}</Title>
      <Text>
        <div>See the <a href={uri} target='_blank'>original post in Medium</a></div>
      </Text>
      <Circle checked={checked}>
        {checked ? '✔' : ''}
      </Circle>
    </Border>
  </Container>
)

export default MediumArticle
