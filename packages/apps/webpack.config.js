// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable camelcase */

const fs = require('fs');
const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const { WebpackPluginServe } = require('webpack-plugin-serve');
const findPackages = require('../../scripts/findPackages');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// const devtool = 'source-map'; //  : 'cheap-eval-source-map',
const devtool = false;
const ENV = process.env.NODE_ENV || 'development';
const isProd = ENV === 'production';
const context = __dirname;
const hasPublic = fs.existsSync(path.join(context, 'public'));

const plugins = isProd
  ? []
  : [
    new WebpackPluginServe({
      hmr: false, // switch off, Chrome WASM memory leak
      liveReload: false, // explict off, overrides hmr
      port: 3000,
      progress: false, // since we have hmr off, disable
      static: path.join(process.cwd(), '/build')
    })
  ];

module.exports = merge(
  baseConfig({
    alias: findPackages().reduce((alias, { dir, name }) => {
      alias[name] = path.resolve(context, `../${dir}/src`);

      return alias;
    }, {}),
    context
  }),
  {
    devtool,
    plugins: plugins.concat([
      new HtmlWebpackPlugin({
        PAGE_TITLE: 'Polkadot/Substrate Portal',
        inject: true,
        template: path.join(context, `${hasPublic ? 'public/' : ''}index.html`)
      })
    ])
  }
);
