import 'babel-polyfill'
import express from 'express'
import path from 'path'
import http from 'http'
import core from 'liqen'
import router from './router'
import setLiqenCore from './middlewares/set-liqen-core'

const app = express()
const PORT = process.env.PORT || 3000
const server = http.Server(app)

if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack')
  const webpackDev = require('webpack-dev-middleware')
  const webpackHot = require('webpack-hot-middleware')
  const webpackConfig = require('../webpack.config.dev')
  const compiler = webpack(webpackConfig)
  const options = {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }

  app.use(webpackDev(compiler, options))
  app.use(webpackHot(compiler))
}

app.set('views', path.join(process.cwd(), 'views'))
app.set('view engine', 'ejs')
app.get('*.js', function (req, res, next) {
  req.url = req.url + '.gz'
  res.set('Content-Encoding', 'gzip')
  next()
})

app.use('/static', express.static('public'))

if (process.env.ONTAG_FAKE_CORE === 'true') {
  const localCore = require('./local-liqen').default
  app.use(setLiqenCore(localCore))
} else {
  app.use(setLiqenCore(core))
}

app.use('/', router)

server.listen(PORT, function () {
  console.log('Listening to port ', PORT)
})
