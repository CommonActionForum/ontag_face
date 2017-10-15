import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'

import reducer from './reducers/index'
import callAPI from './middlewares/call-api'
import addAnnotationColor from './middlewares/add-annotation-color'

import Annotate from './containers/Annotate'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  reducer,
  window.__INITIAL_STATE__,
  composeEnhancers(applyMiddleware(addAnnotationColor, callAPI))
)

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    document.getElementById('react-root')
  )
}

render(Annotate)

if (module.hot) {
  module.hot.accept('./containers/Annotate', () => render(Annotate))
}
