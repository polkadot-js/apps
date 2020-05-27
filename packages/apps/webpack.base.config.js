// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable camelcase */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackPluginServe } = require('webpack-plugin-serve');
const findPackages = require('../../scripts/findPackages');

function createWebpack (ENV, context) {
  const pkgJson = require(path.join(context, 'package.json'));
  const isProd = ENV === 'production';
  const hasPublic = fs.existsSync(path.join(context, 'public'));
  const plugins = hasPublic
    ? [new CopyWebpackPlugin([{ from: 'public' }])]
    : [];

  !isProd && plugins.push(
    new WebpackPluginServe({
      hmr: false, // switch off, Chrome WASM memory leak
      liveReload: false, // explict off, overrides hmr
      port: 3000,
      progress: false, // since we have hmr off, disable
      static: path.join(process.cwd(), '/build')
    })
  );

  const alias = findPackages().reduce((alias, { dir, name }) => {
    alias[name] = path.resolve(context, `../${dir}/src`);

    return alias;
  }, {});

  return {
    context,
    entry: ['@babel/polyfill', './src/index.tsx'],
    mode: ENV,
    module: {
      rules: [
        {
          exclude: /(node_modules)/,
          test: /\.css$/,
          use: [
            isProd
              ? MiniCssExtractPlugin.loader
              : require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1
              }
            }
          ]
        },
        {
          include: /node_modules/,
          test: /\.css$/,
          use: [
            isProd
              ? MiniCssExtractPlugin.loader
              : require.resolve('style-loader'),
            require.resolve('css-loader')
          ]
        },
        {
          exclude: /(node_modules)/,
          test: /\.(js|ts|tsx)$/,
          use: [
            require.resolve('thread-loader'),
            {
              loader: require.resolve('babel-loader'),
              options: require('@polkadot/dev/config/babel')
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
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          use: [
            {
              loader: require.resolve('url-loader'),
              options: {
                esModule: false,
                limit: 10000,
                name: 'static/[name].[hash:8].[ext]'
              }
            }
          ]
        },
        {
          test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/],
          use: [
            {
              loader: require.resolve('file-loader'),
              options: {
                esModule: false,
                name: 'static/[name].[hash:8].[ext]'
              }
            }
          ]
        }
      ]
    },
    node: {
      child_process: 'empty',
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          polkadotJs: {
            chunks: 'initial',
            enforce: true,
            name: 'polkadotjs',
            test: /node_modules\/@polkadot\/(api|api-derive|extension-dapp|keyring|metadata|react-identicon|react-qr|rpc-core|rpc-provider|types|ui-keyring|ui-settings|ui-shared|util|util-crypto|vanitygen|wasm-crypto)/
          },
          vendorOther: {
            chunks: 'initial',
            enforce: true,
            name: 'vendor',
            test: /node_modules\/(asn1|bn\.js|buffer|cuint|elliptic|lodash|moment|readable-stream|rxjs|secp256k1|webrtc-adapter|remark-parse)/
          },
          vendorReact: {
            chunks: 'initial',
            enforce: true,
            name: 'react',
            test: /node_modules\/(@semantic-ui-react|chart|i18next|jidenticon|qrcode-generator|react|react-dom|semantic-ui-css|semantic-ui-react|styled-components)/
          }
        }
      }
    },
    output: {
      chunkFilename: '[name].[chunkhash:8].js',
      filename: '[name].[hash:8].js',
      globalObject: '(typeof self !== \'undefined\' ? self : this)',
      path: path.join(context, 'build'),
      publicPath: ''
    },
    performance: {
      hints: false
    },
    plugins: plugins.concat([
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(ENV),
          VERSION: JSON.stringify(pkgJson.version),
          WS_URL: JSON.stringify(process.env.WS_URL)
        }
      }),
      new webpack.optimize.SplitChunksPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css'
      })
    ]).filter((plugin) => plugin),
    resolve: {
      alias,
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    watch: !isProd,
    watchOptions: {
      ignored: ['.yarn', /build/, /node_modules/]
    }
  };
}

module.exports = createWebpack;
