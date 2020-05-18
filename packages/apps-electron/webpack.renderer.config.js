// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/camelcase */

const merge = require('webpack-merge');
const baseConfig = require('@polkadot/apps/webpack.base.config');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ENV = process.env.NODE_ENV || 'development';
const isProd = ENV === 'production';

const config = {
  devServer: {
    compress: true,
    contentBase: path.join(__dirname, 'build'),
    hot: true,
    liveReload: false,
    port: 9000
  },
  devtool: isProd ? 'none' : 'source-map',
  plugins: [new CopyWebpackPlugin([{ from: '../apps/public' }])],
  target: 'electron-renderer'
};

module.exports = merge(baseConfig, config);
