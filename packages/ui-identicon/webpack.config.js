// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

const ENV = process.env.NODE_ENV || 'development';
const isProd = ENV === 'production';

module.exports = {
  context: __dirname,
  devtool: isProd ? 'source-map' : 'cheap-eval-source-map',
  entry: './src/demo.js',
  mode: ENV,
  output: {
    path: __dirname,
    filename: './demo.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          'babel-loader'
        ]
      }
    ]
  },
  plugins: []
};
