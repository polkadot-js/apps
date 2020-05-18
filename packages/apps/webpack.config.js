// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/camelcase */

const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const { WebpackPluginServe } = require('webpack-plugin-serve');

const devtool = false;
const ENV = process.env.NODE_ENV || 'development';
const isProd = ENV === 'production';

const config = { devtool };

if (!isProd) {
  config.plugins = [
    new WebpackPluginServe({
      hmr: false, // switch off, Chrome WASM memory leak
      liveReload: false, // explict off, overrides hmr
      port: 3000,
      progress: false, // since we have hmr off, disable
      static: path.join(process.cwd(), '/build')
    })
  ];
}

module.exports = merge(baseConfig, config);
