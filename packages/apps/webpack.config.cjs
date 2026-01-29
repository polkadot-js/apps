// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { merge } = require('webpack-merge');
const { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity');

const baseConfig = require('./webpack.base.cjs');

const context = __dirname;
const hasPublic = fs.existsSync(path.join(context, 'public'));

module.exports = merge(
  baseConfig(context),
  {
    devtool: process.env.BUILD_ANALYZE ? 'source-map' : false,
    output: {
      crossOriginLoading: 'anonymous'
    },
    plugins: [
      new SubresourceIntegrityPlugin(),
      new HtmlWebpackPlugin({
        PAGE_TITLE: 'Polkadot/Substrate Portal',
        minify: false,
        template: path.join(context, `${hasPublic ? 'public/' : ''}index.html`)
      })
    ]
  }
);
