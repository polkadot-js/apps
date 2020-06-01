// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable camelcase */

const fs = require('fs');
const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const context = __dirname;
const hasPublic = fs.existsSync(path.join(context, 'public'));

const ENV = process.env.NODE_ENV || 'development';

module.exports = merge(
  baseConfig(ENV, context),
  {
    devtool: false,
    plugins: [
      new HtmlWebpackPlugin({
        PAGE_TITLE: 'Polkadot/Substrate Portal',
        inject: true,
        template: path.join(context, `${hasPublic ? 'public/' : ''}index.html`)
      })
    ]
  }
);
