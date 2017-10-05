const path = require('path')
const webpack = require('webpack')
const config = require('./webpack.config')

module.exports = {
  devtool: 'inline-source-map',

  context: config.context,

  entry: {
    dashboard: ['webpack-hot-middleware/client', './dashboard'],
    'import-from-medium': ['webpack-hot-middleware/client', './import-from-medium'],
    annotate: ['webpack-hot-middleware/client', 'react-hot-loader/patch', './annotate'],
    dumb: './dumb'
  },

  output: {
    path: path.join(__dirname, 'public/dist'),
    filename: '[name].js',
    publicPath: '/static/dist'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['react-hot-loader/webpack', 'babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      ONTAG_FAKE_CORE: process.env.ONTAG_FAKE_CORE,
      DEBUG: true
    })
  ],

  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, 'public/dist'),
    publicPath: '/static/dist'
  }
}
