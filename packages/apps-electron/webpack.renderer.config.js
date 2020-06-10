// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable camelcase */

const path = require('path');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('@polkadot/apps/webpack.base.config');

const ENV = process.env.NODE_ENV || 'production';
const isProd = ENV === 'production';
const context = __dirname;

module.exports = merge(
  baseConfig(ENV, context),
  {
    devtool: isProd ? 'none' : 'source-map',
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
