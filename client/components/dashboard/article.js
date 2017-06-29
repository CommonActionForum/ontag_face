import React from 'react'

function getColorFromId (id) {
  const hue = (id * 97) % 360
  return `hsl(${hue}, 32%, 68%)`
}

const Article = ({ link, title, id }) => (
  <div className='card'>
    <div className='card-img-top'
      style={{height: '5em', background: getColorFromId(id)}}
      alt='Card image cap' />
    <div className='card-block'>
      <h4 className='card-title'>
        <a href={link}>
          {title}
        </a>
      </h4>
      <p className='card-text'>
        <small className='text-muted'></small>
      </p>
    </div>
  </div>
)

export default Article
