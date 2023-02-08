// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable camelcase */

const fs = require('fs');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const findPackages = require('../../scripts/findPackages.cjs');

function mapChunks (pre, regs) {
  return regs.reduce((result, test, index) => {
    const name = `${pre}.${`00${index}`.slice(-2)}`;

    result[name] = {
      chunks: 'initial',
      enforce: true,
      name,
      test
    };

    return result;
  }, {});
}

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
      splitChunks: {
        cacheGroups: {
          // As far as possible, we try and keep this below 1M in size.
          // This is trial-and-error and some will blow past, e.g. light client
          ...mapChunks('mod.app', [
            /* 00 */ /apps-config\/src\/api/,
            /* 01 */ /apps-config\/src\/ui\/logos\/chains/,
            /* 03 */ /apps-config\/src\/ui\/logos\/(extensions|external|nodes\/generated\/[0-9a-kA-K])/,
            /* 04 */ /apps-config\/src\/ui\/logos\/nodes\/generated\/[l-zL-Z]/,
            /* 05 */ /RoboHash\/(backgrounds|sets\/set2)/,
            /* 06 */ /RoboHash\/sets\/set1-(blue|brown|green|grey|orange)/,
            /* 07 */ /RoboHash\/sets\/set1-(pink|purple|red|white|yellow)/,
            /* 08 */ /RoboHash\/sets\/set3/,
            /* 09 */ /RoboHash\/sets\/set4/,
            /* 10 */ /RoboHash\/sets\/set5\/(000|001|002|003|004|005|007)/,
            /* 11 */ /RoboHash\/sets\/set5\/006/
          ]),
          ...mapChunks('mod.dot', [
            // If we ever want to go deeper, this seemed like a good 50/50
            // initial split ... could change over time
            // /* 00 */ /node_modules\/@polkadot\/(api|metadata|types)/,
            // /* 01 */ /node_modules\/@polkadot\/(?!api|metadata|types)/
            /* 00 */ /node_modules\/@polkadot\//,
          ]),
          // We didn't pull these based on name, but rather based on the sizes
          // (large => small) as available in yarn analyze. The names here are
          // intentionally greedy (without having conflicts with previous)
          ...mapChunks('mod.ext', [
            /* 00 */ /node_modules\/@substrate\/smoldot/,
            /* 01 */ /node_modules\/@fortawesome/,
            /* 02 */ /node_modules\/(react|qrcode|lodash|inherits|attr|is|util|simple|unist|decode|hoist|html|owasp|@stardust|base|@multiformats|multiformats|sha|elliptic|hast|bn|webrtc|@ledgerhq|semver|zwitch|hash|color|sdp|@interlay|fflate|event|vfile|ethereum|detect|lru|ed2curve|iso|uint8arrays|hmac|process|cipher|borand|safe|minimalistic|value|comma|file)/,
            /* 03 */ /node_modules\/(style|chart|pako|@noble|rxjs|tweetnacl|codeflask|@zondax|axios|resolve|classnames|exe|history|query|string|tslib|md5|punycode|buffer|semantic|@semantic|core|i18next|readable|rtc|@substrate\/(connect|ss58)|secp256k1|@emotion|store|web|@babel|jdenticon|yalist|scheduler|keyboard|ripemd160|@chainsafe|bip|copy|inline|stream|ieee|prop|toggle|err|create|regenerator|@scure)/
          ])
        }
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
        resourceRegExp: /^\.\/locale$/
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
