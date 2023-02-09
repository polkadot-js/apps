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
            require.resolve('css-loader')
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
        },
        {
          test: /\.md$/,
          use: [
            require.resolve('html-loader'),
            require.resolve('markdown-loader')
          ]
        },
        {
          exclude: [/semantic-ui-css/],
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          type: 'asset/resource',
          generator: {
            filename: 'static/[name].[contenthash:8].[ext]'
          }
        },
        {
          exclude: [/semantic-ui-css/],
          test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/],
          type: 'asset/resource',
          generator: {
            filename: 'static/[name].[contenthash:8].[ext]'
          }
        },
        {
          include: [/semantic-ui-css/],
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/],
          use: [
            {
              loader: require.resolve('null-loader')
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
            maxSize: 1_300_000,
            minSize: 0,
            priority: -1 * index,
            test
          }
        }), {}),
        name: 'x'
      }
    },
    output: {
      chunkFilename: '[name].[chunkhash:8].js',
      filename: '[name].[contenthash:8].js',
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
        filename: '[name].[contenthash:8].css'
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
