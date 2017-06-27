import React from 'react'
import PropTypes from 'prop-types'

export default function LiqenCreator ({ onSubmit, answer, question }) {
  const tags = answer.map(
    (a, i) => a.annotations.length > 0
          ? <mark key={i}><strike>{a.tag}</strike></mark>
          : <mark key={i}>{a.tag}</mark>
  )

  const pluralize = (tags) => {
    const ret = []
    const exceptLast = tags.slice(0, -1)
    const last = tags[tags.length - 1]

    exceptLast.forEach(tag => {
      ret.push(tag)
      ret.push(', ')
    })
    ret[ret.length - 1] = ' and '
    ret.push(last)

    return ret
  }

  return (
    <div className='card'>
      <div className='card-block'>
        <h4 className='card-title'>{question}</h4>
        <p className='card-text small'>
          <span>Highlight at least one </span>
          {
            tags.length === 1 ? tags : pluralize(tags)
          }
          <span> in the text to answer this question</span>
        </p>
      </div>
      <div>
        <ul className='list-group list-group-flush'>
          {
            answer.map(({tag, annotations}, i) => (
              <li
                className='list-group-item'
                key={i}
              >
                <span className='badge badge-default'># {tag}</span>
                <AnnotationList annotations={annotations} />
              </li>
            ))
          }
        </ul>
        <div className='card-block text-right'>
          <button
            className="btn btn-primary"
            disabled={!onSubmit}
            onClick={() => onSubmit()}>Send Liqen</button>
        </div>
      </div>
    </div>
  )
}

LiqenCreator.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.arrayOf(
    PropTypes.shape({
      tag: PropTypes.string.isRequired,
      annotations: PropTypes.arrayOf(
        PropTypes.shape({
          fragment: PropTypes.string.isRequired
        })
      )
    })
  ).isRequired,
  onSubmit: PropTypes.func
}

class AnnotationList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {expanded: false}
    this.expand = this.expand.bind(this)
  }

  expand () {
    this.setState({expanded: true})
  }

  compress () {
    this.setState({expanded: false})
  }

  render () {
    return (
      <div className='w-100'>
        {
          this.props.annotations.length === 1 && (
            <blockquote
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                height: '1.5em'
              }}
            >
              {this.props.annotations[0].fragment}
            </blockquote>
          )
        }
        {
          this.props.annotations.length > 1 && !this.state.expanded && (
            <blockquote>
              <span>{this.props.annotations.length} annotations </span>
              <a
                className='btn btn-sm btn-link'
                href='javascript:void(0)'
                onClick={() => this.expand()}
              >
                Show
              </a>
            </blockquote>
          )
        }
        {
          this.props.annotations.length > 1 && this.state.expanded && (
            <div>
              <div>
                {
                  this.props.annotations.map(({fragment, active}, i) => (
                    <div
                      key={i}
                      className='form-check'
                    >
                      <label className='form-check-label'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          checked={active}
                        />
                        &nbsp;{fragment}
                      </label>
                    </div>
                  ))
                }
              </div>
              <a
                className='btn btn-sm btn-link'
                href='javascript:void(0)'
                onClick={() => this.compress()}
              >
                Hide
              </a>
            </div>
          )
        }
      </div>
    )
  }
}
