'use strict';

module.exports = {
  entry: "./demo/index.js",
  output: {
    path: "./public_html",
    filename: "demo.js"
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules.*\.js/, loader: 'babel-loader' },
    ],
  }
};
