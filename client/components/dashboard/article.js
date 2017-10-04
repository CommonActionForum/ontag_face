import React from 'react'
import styled from 'styled-components'

const UnstyledContainer = ({ className, children }) => (
  <div className={`col-12 col-md-6 col-lg-4 ${className}`}>
    {children}
  </div>
)

const Container = styled(UnstyledContainer)`
  padding-top: 2rem;
  margin-bottom: 1rem;
`

const UnstyledImage = ({ className, children, link, image }) => (
  <a className={className}
    href={link}
    style={{backgroundImage: `url(${image})`}}
  />
)

const HeaderImage = styled(UnstyledImage)`
  display: block;
  background-size: cover;
  height: 10rem;
`

const Title = styled.h2`
  padding: 1rem 0 0 0;
  font-size: 1.25rem;
`

const Metadata = styled.div`
  padding: 1rem 0;
  display: flex;
  align-items: center;
  border-bottom: 1px #999 solid;
`

const AvatarContainer = styled.div`
  width: 40px;
`

const AvatarImage = styled.div`
  display: block;
  border-radius: 100%;
  width: 40px;
  height: 40px;
  background-size: cover;
`

const Avatar = ({uri}) => (
  <AvatarContainer>
    <AvatarImage style={{backgroundImage: `url(${uri})`}} />
  </AvatarContainer>
)

const Text = styled.div`
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  color: #666;
`

const Article = ({ questionId, title, uri, image, id }) => (
  <Container>
    <HeaderImage
      link={`/annotate/?entry=${id}&question=${questionId}`}
      image={image}
    />
    <Title>
      <a href={`/annotate/?entry=${id}&question=${questionId}`}>
        {title}
      </a>
    </Title>
    <Metadata>
      <Avatar uri='/static/imgs/medium-logo.png' />
      <Text>
        <div>Published originally <a href={uri}>in Medium</a></div>
      </Text>
    </Metadata>
  </Container>
)

export default Article
