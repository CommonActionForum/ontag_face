import React from 'react'
import PropTypes from 'prop-types'

export default function LiqenCreator ({
  onSubmit,
  onAddAnnotation,
  onRemoveAnnotation,
  answer,
  question
}) {
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
                <AnnotationList
                  annotations={annotations}
                  onAdd={onAddAnnotation}
                  onRemove={onRemoveAnnotation}
                />
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
    this.compress = this.compress.bind(this)
    this.change = this.change.bind(this)
  }

  expand () {
    this.setState({expanded: true})
  }

  compress () {
    this.setState({expanded: false})
  }

  change (cid, activate) {
    if (activate) {
      this.props.onAdd(cid)
    } else {
      this.props.onRemove(cid)
    }
  }

  render () {
    const totalAnnotations = this.props.annotations
    const activeAnnotations = totalAnnotations.filter(a => a.active)

    return (
      <div className='w-100'>
        <div>
          {
            totalAnnotations.length === 0 && activeAnnotations.length === 0 && (
              <blockquote
                style={{
                  height: '1.5em'
                }}
              />
            )
          }
        </div>
        <div>
          {
            (totalAnnotations.length > 0 || activeAnnotations.length > 0) &&
            !this.state.expanded && (
              <div>
                <blockquote
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    height: '1.5em',
                    marginBottom: '0.5rem'
                  }}
                >
                  {
                    activeAnnotations.length === 0 &&
                    <span>
                      No annotations selected. &nbsp;

                    </span>
                  }
                  {
                    activeAnnotations.length === 1 &&
                    <span>{activeAnnotations[0].fragment}</span>

                  }
                  {
                    activeAnnotations.length > 1 &&
                    <span>{totalAnnotations.length} annotations </span>
                  }
                </blockquote>
                <div className='small text-right'>
                  <a
                    href='javascript:void(0)'
                    onClick={() => this.expand()}
                  >
                    Add/remove annotations
                  </a>
                </div>
              </div>
            )
          }
        </div>
        <div>
          {
            (totalAnnotations.length > 0 || activeAnnotations.length > 0) &&
            this.state.expanded && (
              <div>
                <div>
                  {
                    totalAnnotations.map(({fragment, active, cid}) => (
                      <div
                        key={cid}
                        className='form-check'
                      >
                        <label className='form-check-label'>
                          <input
                            className='form-check-input'
                            type='checkbox'
                            checked={active}
                            onChange={() => this.change(cid, !active)}
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
                  Confirm selection
                </a>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}
