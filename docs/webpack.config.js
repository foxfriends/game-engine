'use strict';
const path = require('path');

module.exports = {
  entry: './script/index.js',
  output: {
    path: './public_html',
    filename: 'index.min.js',
  },
  module: {
    loaders: [
      { test: /\.(s|a)?css/, loader: 'style-loader!css-loader!sass-loader'}
    ]
  },
  resolve: {
    alias: {
      'style': path.resolve(__dirname, 'style')
    }
  }
};
