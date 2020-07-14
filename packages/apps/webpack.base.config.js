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
    ? [new CopyWebpackPlugin({ patterns: [{ from: 'public' }] })]
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
          polkadotJsApi: {
            chunks: 'initial',
            enforce: true,
            name: 'polkadotjs.api',
            test: /node_modules\/@polkadot\/(api|metadata|rpc|types)/
          },
          polkadotJsOther: {
            chunks: 'initial',
            enforce: true,
            name: 'polkadotjs.util',
            test: /node_modules\/(@ledgerhq|@zondax|edgeware|@polkadot\/(extension|keyring|react|ui|util|vanitygen))/
          },
          polkadotJsWasm: {
            chunks: 'initial',
            enforce: true,
            name: 'polkadotjs.wasm',
            test: /node_modules\/@polkadot\/(wasm)/
          },
          reactBase: {
            chunks: 'initial',
            enforce: true,
            name: 'react.base',
            test: /node_modules\/(react|react-dom|styled-components)/
          },
          reactIcons: {
            chunks: 'initial',
            enforce: true,
            name: 'react.fa',
            test: /node_modules\/(@fortawesome)/
          },
          reactSUI: {
            chunks: 'initial',
            enforce: true,
            name: 'react.sui',
            test: /node_modules\/(@semantic-ui-react|semantic-ui-react|semantic-ui-css)/
          },
          reactUI: {
            chunks: 'initial',
            enforce: true,
            name: 'react.ui',
            test: /node_modules\/(chart\.js|codeflask|copy-to-clipboard|i18next|jdenticon|qrcode-generator|react-i18next|react-qr-reader)/
          },
          vendor01: {
            chunks: 'initial',
            enforce: true,
            name: 'other.01',
            test: /node_modules\/(ansi-styles|asn1|base-x|base64-js|blakejs|bip39|bip66|bn\.js|browserify-aes|browserify-cipher|browserify-des|browserify-rsa|browserify-sign|chalk|cipher-base|color|color-convert|color-name|color-string)/
          },
          vendor02: {
            chunks: 'initial',
            enforce: true,
            name: 'other.02',
            test: /node_modules\/(create-ecdh|create-hash|create-hmac|crypto-browserify|cuint|des\.js|diffie-hellman|elliptic|hash|lodash|secp256k1)/
          },
          vendor03: {
            chunks: 'initial',
            enforce: true,
            name: 'other.03',
            test: /node_modules\/(hmac-drbg|js-sha3|md5|memoizee|miller-rabin|minimalistic-crypto-utils|moment|path-browserify|path-to-regex|parse-asn1|pbkdf2|public-encrypt|query-string|randombytes|randomfill|ripemd160|readable-stream|remark-parse|rtcpeerconnection-shim|sdp|sha\.js|store|webrtc-adapter|xxhashjs)/
          },
          vendor04: {
            chunks: 'initial',
            enforce: true,
            name: 'other.04',
            test: /node_modules\/(@babel|core-js|core-util|buffer|deep-equal|detect-browser|es-abstract|es5-ext|es6-symbol|event-emitter|events|eventemitter3|extend|has-symbols|history|is-|node-libs-browser|object-assign|object-is|object-keys|process|regenerator-runtime|rxjs|safe-buffer|scheduler|timers-browserify|tslib|unified|util|vfile|vm-browserify|whatwg-fetch)/
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
