var path = require('path');
var webpack = require('webpack');
require("babel-polyfill");

module.exports = {
  entry: [ 'babel-polyfill', './src/index.js' ],
  output: {
    path: './dist',
    filename: 'index.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: 'node_modules',
        loader: 'babel-loader',
        presets: [ 'es2015', 'stage-2' ]
      }
    ]
  }
}
