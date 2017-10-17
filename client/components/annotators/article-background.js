import React from 'react'
import PropTypes from 'prop-types'

export default function ArticleBackground ({width, height, paths, colors, style}) {
  // paths.forEach(p => p.nodes.forEach(n => console.log(p.color, n.offset)))

  const renderedPaths = paths.map((p, i) => {
    const nodes = p.nodes
                   .sort((a, b) => a.x - b.x)
                   .sort((a, b) => a.y - b.y)

    const [firstNode, ...restNodes] = nodes
    const d = `M ${firstNode.x + 24 + firstNode.offset * 12} ${firstNode.y + 6 - firstNode.offset}` + ' ' +
              restNodes.map(({x, y, offset}) => `L ${x + 24 + offset * 12} ${y + 6 - offset}`).join(' ')

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
          y: PropTypes.number.isRequired,
          offset: PropTypes.number
        })
      ),
      color: PropTypes.string
    })
  ),
  width: PropTypes.number,
  height: PropTypes.number,
}
