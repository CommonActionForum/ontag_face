import React from 'react'
import PropTypes from 'prop-types'
import ProgressBar from './progress-bar'

export default class SelectableAnnotation extends React.Component {
  render () {
    return (
      <div>
        <span className="badge badge-default">
          # {this.props.tag}
        </span>
        <p className='mb-0'>
          {this.props.target.exact}
        </p>
        <ProgressBar completed={!this.props.pending} />
      </div>
    )
  }
}

SelectableAnnotation.propTypes = {
  checked: PropTypes.bool,
  tag: PropTypes.string.isRequired,
  target: PropTypes.shape({
    prefix: PropTypes.string.isRequired,
    exact: PropTypes.string.isRequired,
    suffix: PropTypes.string.isRequired
  }),
  pending: PropTypes.bool,
  onSelect: PropTypes.func
}
