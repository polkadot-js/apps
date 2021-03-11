// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable camelcase */

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { merge } = require('webpack-merge');

const baseConfig = require('../apps/webpack.base.cjs');

const context = __dirname;

module.exports = merge(
  baseConfig(context, 'development'),
  {
    plugins: [
      // It must be placed before HtmlWebpackPlugin
      new CopyWebpackPlugin({ patterns: [{ from: '../apps/public' }] }),
      new HtmlWebpackPlugin({
        PAGE_TITLE: 'Polkadot/Substrate Portal',
        inject: true,
        template: path.join(context, '../apps/public/index.html')
      })
    ],
    target: 'web'
  }
);
