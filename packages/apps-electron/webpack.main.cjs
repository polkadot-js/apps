// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable camelcase */

const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

function createWebpack () {
  return [
    {
      entry: {
        electron: './src/electron',
        preload: './src/preload.ts'
      },
      mode: 'production',
      module: {
        rules: [
          {
            include: /node_modules/,
            test: /\.mjs$/,
            type: 'javascript/auto'
          },
          {
            exclude: /(node_modules)/,
            test: /\.(ts|tsx)$/,
            use: [
              {
                loader: require.resolve('ts-loader'),
                options: {
                  configFile: 'tsconfig.webpack.json',
                  transpileOnly: true
                }
              }
            ]
          }
        ]
      },
      node: {
        __dirname: false,
        __filename: false
      },
      output: {
        filename: '[name].js',
        path: path.join(__dirname, '/build')
      },
      plugins: [
        new CopyWebpackPlugin({ patterns: [{ from: 'assets' }] })
      ],
      resolve: {
        alias: {
          '@polkadot/hw-ledger-transports': require.resolve('@polkadot/hw-ledger-transports/node')
        },
        extensionAlias: {
          '.js': ['.ts', '.tsx', '.js']
        },
        extensions: ['.js', '.jsx', '.json', '.mjs', '.ts', '.tsx']
      },
      target: 'electron-main'
    }
  ];
}

module.exports = createWebpack();
