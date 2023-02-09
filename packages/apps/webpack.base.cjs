// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable camelcase */

const fs = require('fs');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const findPackages = require('../../scripts/findPackages.cjs');

function createWebpack (context, mode = 'production') {
  const pkgJson = require(path.join(context, 'package.json'));
  const alias = findPackages().reduce((alias, { dir, name }) => {
    alias[name] = path.resolve(context, `../${dir}/src`);

    return alias;
  }, {});
  const plugins = fs.existsSync(path.join(context, 'public'))
    ? new CopyWebpackPlugin({
      patterns: [{
        from: 'public',
        globOptions: {
          dot: true,
          ignore: ['**/index.html']
        }
      }]
    })
    : [];

  return {
    context,
    entry: ['@babel/polyfill', './src/index.tsx'],
    mode,
    module: {
      rules: [
        {
          scheme: 'data',
          type: 'asset/resource',
        },
        {
          include: /node_modules/,
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: require.resolve('css-loader'),
              options: {
                url: false
              }
            }
          ]
        },
        {
          exclude: /(node_modules)/,
          test: /\.(js|mjs|ts|tsx)$/,
          use: [
            require.resolve('thread-loader'),
            {
              loader: require.resolve('babel-loader'),
              options: require('@polkadot/dev/config/babel-config-webpack.cjs')
            }
          ]
        }
      ]
    },
    node: {
      __dirname: true,
      __filename: false
    },
    optimization: {
      minimize: mode === 'production',
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: [
          /apps-config[\\/]src[\\/]api[\\/]typesBundle/,
          /apps-config[\\/]src[\\/]ui[\\/]logos/,
          /react-components[\\/]src[\\/]IdentityIcon[\\/]RoboHash/,
          /node_modules/
        ].reduce((result, test, index) => ({
          ...result,
          [`cacheGroup${index}`]: {
            chunks: 'initial',
            enforce: true,
            maxSize: 1_500_000,
            minSize: 0,
            priority: -1 * index,
            test
          }
        }), {})
      }
    },
    output: {
      // this is for dynamic imports
      chunkFilename: 'dyn.[contenthash].js',
      // this is via splitChunks
      filename: ({ chunk: { name } }) =>
        ['main', 'runtime'].includes(name)
          ? `${name === 'main' ? 'app' : 'run'}.[contenthash].js`
          : 'mod.[contenthash].js',
      globalObject: '(typeof self !== \'undefined\' ? self : this)',
      hashFunction: 'xxhash64',
      path: path.join(context, 'build'),
      publicPath: ''
    },
    performance: {
      hints: false
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser.js'
      }),
      new webpack.IgnorePlugin({
        contextRegExp: /moment$/,
        resourceRegExp: /^\.[\\/]locale$/
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(mode),
          VERSION: JSON.stringify(pkgJson.version),
          WS_URL: JSON.stringify(process.env.WS_URL)
        }
      }),
      new webpack.optimize.SplitChunksPlugin(),
      new MiniCssExtractPlugin({
        filename: 'res.[contenthash].css'
      })
    ].concat(plugins),
    resolve: {
      alias,
      extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx'],
      fallback: {
        assert: require.resolve('assert/'),
        crypto: require.resolve('crypto-browserify'),
        fs: false,
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        path: require.resolve('path-browserify'),
        stream: require.resolve('stream-browserify')
      }
    }
  };
}

module.exports = createWebpack;
