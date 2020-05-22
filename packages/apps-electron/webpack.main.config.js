// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/camelcase */

const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const ENV = process.env.NODE_ENV || 'development';
const isProd = ENV === 'production';

function createWebpack () {
  return [
    {
      entry: './src/electron.ts',
      mode: ENV,
      module: {
        rules: [
          {
            exclude: /(node_modules)/,
            test: /\.(js|ts|tsx)$/,
            use: [
              require.resolve('thread-loader'),
              {
                loader: require.resolve('babel-loader'),
                options: require('@polkadot/dev/config/babel')
              }
            ]
          }
        ]
      },
      node: {
        __dirname: false
      },
      optimization: {
        minimize: !!isProd,
        minimizer: [new TerserPlugin()]
      },
      output: {
        filename: 'electron.js',
        path: path.join(__dirname, '/build')
      },
      target: 'electron-main'
    }
  ];
}

module.exports = createWebpack();
