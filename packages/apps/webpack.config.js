// Copyright 2017-2020 @canvas-ui/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
        PAGE_TITLE: 'Canvas',
        inject: true,
        template: path.join(context, `${hasPublic ? 'public/' : ''}index.html`)
      })
    ]
  }
);
