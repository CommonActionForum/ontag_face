const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  context: path.join(__dirname, 'client'),

  entry: {
    dashboard: './dashboard',
    annotate: './annotate',
    dumb: './dumb'
  },

  output: {
    path: path.join(__dirname, 'public/dist'),
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['es2015', 'es2016', 'react']
        }
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract({
          use: [
            'css-loader',
            'sass-loader'
          ]
        })
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin('[name].css'),
    new CompressionPlugin({
      test: /\.js$|\.css$|\.html$/,
      algorithm: 'gzip',
      asset: '[path].gz[query]',
      threshold: 10240,
      minRatio: 0.8
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      LIQEN_API_URI: process.env.LIQEN_API_URI
    })
  ]
}
