// Copyright 2017-2018 @polkadot/ui-react authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

const path = require('path');
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
  resolve: {
    alias: {
      '@polkadot/ui-identicon': path.resolve(__dirname, '../ui-identicon/src/index.js')
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: []
};
