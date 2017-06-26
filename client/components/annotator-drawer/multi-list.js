import React from 'react'
import PropTypes from 'prop-types'

import AnnotationsList from './annotations-list'
import LiqensList from './liqens-list'

export default class MultiList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      show: 'annotations'
    }

    this.handleChangeView = this.handleChangeView.bind(this)
  }

  handleChangeView (newView) {
    this.setState({show: newView})
  }

  render () {
    const {
      annotations,
      liqens
    } = this.props

    return (
      <div className='card'>
        <div className='card-header'>
          <ul className='nav nav-pills card-header-pills'>
            <li className='nav-item'>
              <a
                className={'nav-link btn-sm ' + (this.state.show === 'annotations' && 'active')}
                href='#'
                onClick={() => this.handleChangeView('annotations')}
              >
                Annotations
              </a>
            </li>
            <li className='nav-item'>
              <a
                className={'nav-link btn-sm ' + (this.state.show === 'liqens' && 'active')}
                href='#'
                onClick={() => this.handleChangeView('liqens')}
              >
                Liqens
              </a>
            </li>
          </ul>
        </div>
        <div>
          {
            this.state.show === 'annotations' && (
              <AnnotationsList
                annotations={annotations}
                onSelect={(e) => console.log(e)}
              />
            )
          }
        </div>
        <div>
          {
            this.state.show === 'liqens' && (
              <LiqensList
                liqens={liqens}
              />
            )
          }
        </div>
      </div>
    )
  }
}

MultiList.propTypes = {
  liqens: PropTypes.array,
  annotations: PropTypes.array
}
