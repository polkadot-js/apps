// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable camelcase */

const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const ENV = process.env.NODE_ENV || 'production';
const isProd = ENV === 'production';

function createWebpack () {
  return [
    {
      entry: {
        electron: './src/electron',
        preload: './src/preload.ts'
      },
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
        filename: '[name].js',
        path: path.join(__dirname, '/build')
      },
      plugins: [
        new CopyWebpackPlugin({ patterns: [{ from: 'assets' }] })
      ],
      resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
      },
      target: 'electron-main'
    }
  ];
}

module.exports = createWebpack();
