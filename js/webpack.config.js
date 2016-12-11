'use strict';

module.exports = [{
    entry: './src/index.js',
    output: {
      path: './',
      filename: 'engine.js',
      library: 'engine',
      libraryTarget: 'commonjs2'
    },
    module: {
      loaders: [
        { test: /\.js$/, exclude: /node_modules.*\.js/, loader: 'babel-loader' },
      ],
    }
  }, {
    entry: './demo/index.js',
    output: {
      path: './public_html',
      filename: 'demo.js'
    },
    module: {
      loaders: [
        { test: /\.js$/, exclude: /node_modules.*\.js/, loader: 'babel-loader' },
      ],
    }
  }
];
