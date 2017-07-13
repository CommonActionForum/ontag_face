import React from 'react'
import PropTypes from 'prop-types'

export default function ArticleBackground ({width, height, paths, style}) {
  const renderedPaths = paths.map((p, i) => {
    const [firstNode, ...restNodes] = p.nodes
    const d = `M ${firstNode.x} ${firstNode.y}` + ' ' +
              restNodes.map(({x, y}) => `L ${x} ${y}`).join(' ')

    return <path key={i} d={d} fill='transparent' stroke={p.color || 'black'} />
  })
  return (
    <svg width={width} height={height} style={style}>
      {renderedPaths}
    </svg>
  )
}

ArticleBackground.propTypes = {
  paths: PropTypes.arrayOf(
    PropTypes.shape({
      nodes: PropTypes.arrayOf(
        PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired
        })
      ),
      color: PropTypes.string
    })
  ),
  width: PropTypes.number,
  height: PropTypes.number
}
