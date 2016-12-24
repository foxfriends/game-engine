'use strict';

module.exports = [{
  entry: './src/index.js',
  output: {
    path: './',
    filename: 'index.js'
  },
  target: 'electron',
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules.*\.js/, loader: 'babel-loader' }
    ]
  }
}, {
  entry: './src/editor/index.js',
  output: {
    path: './',
    filename: 'editor.js'
  },
  target: 'electron-renderer',
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules.*\.js/, loader: 'babel-loader' },
      { test: /\.json$/, exclude: /node_modules.*\.json/, loader: 'json-loader' },
      { test: /\.s(a|c)ss$/, exclude: /node_modules.*\.json/, loader: 'style-loader!css-loader!sass-loader' }
    ]
  }
}];
