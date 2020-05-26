// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable camelcase */

const merge = require('webpack-merge');
const baseConfig = require('@polkadot/apps/webpack.base.config');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const findPackages = require('../../scripts/findPackages');

const ENV = process.env.NODE_ENV || 'production';
const isProd = ENV === 'production';
const context = __dirname;

module.exports = merge(
  baseConfig({
    ENV,
    alias: findPackages().reduce((alias, { dir, name }) => {
      alias[name] = path.resolve(context, `../${dir}/src`);

      return alias;
    }, {}),
    context,
    isProd
  }),
  {
    devServer: {
      compress: true,
      contentBase: path.join(__dirname, 'build'),
      hot: true,
      liveReload: false,
      port: 9000
    },
    devtool: isProd ? 'none' : 'source-map',
    plugins: [
      new CopyWebpackPlugin([{ from: '../apps/public' }]),
      new HtmlWebpackPlugin({
        PAGE_TITLE: 'Polkadot/Substrate Portal',
        inject: true,
        template: path.join(context, '../apps/public/index.html')
      })
    ],
    target: 'electron-renderer'
  }
);
