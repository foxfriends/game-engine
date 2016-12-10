'use strict';

module.exports = {
  entry: "./src/index.js",
  output: {
    path: "./",
    filename: "engine.js"
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules.*\.js/, loader: 'babel?plugins[]=transform-es2015-modules-commonjs' },
    ],
  },
  devtool: ['source-map']
};
