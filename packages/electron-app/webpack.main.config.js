// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/camelcase */

const path = require('path');
const ENV = process.env.NODE_ENV || 'development';

function createWebpack () {
  return [
    {
      entry: './src/electron.ts',
      mode: ENV,
      output: {
        filename: 'electron.js',
        path: path.join(__dirname, '/build')
      },
      target: 'electron-main'
    }
  ];
}

module.exports = createWebpack();
