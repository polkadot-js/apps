// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

const baseConfig = require('./webpack.config.js');

module.exports = merge(
  baseConfig,
  {
    devServer: {
      open: true,
      static: path.resolve(__dirname, 'build')
    },
    mode: 'development',
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  }
);
