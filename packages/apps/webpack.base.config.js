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
            name: 'polkadotjs.libs',
            test: /node_modules\/(@ledgerhq|@zondax|edgeware|@polkadot\/(api|extension|keyring|metadata|react|rpc|types|ui|util|vanitygen))/
          },
          polkadotJsWasm: {
            chunks: 'initial',
            enforce: true,
            name: 'polkadotjs.wasm',
            test: /node_modules\/@polkadot\/(wasm)/
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
            test: /node_modules\/(@semantic-ui-react|@stardust|classnames|keyboard-key|prop-types|semantic-ui-react|semantic-ui-css)/
          },
          reactUI: {
            chunks: 'initial',
            enforce: true,
            name: 'react.ui',
            test: /node_modules\/(@emotion|chart\.js|codeflask|copy-to-clipboard|create-react|file-selector|file-saver|hoist-non-react|i18next|jdenticon|mini-create-react|popper\.js|qrcode-generator|react|react-|remark-parse|styled-components)/
          },
          vendor01: {
            chunks: 'initial',
            enforce: true,
            name: 'other.01',
            test: /node_modules\/(@babel|ansi-styles|asn1|browserify-|chalk|color|color-|crypto-browserify|des\.js|diffie-hellman|elliptic|event-emitter|events|eventemitter3|hash|hmac-drbg|js-sha3|lodash|md5|memoizee|miller-rabin|object-|path-|parse-asn1|pbkdf2|process|public-encrypt|query-string|ripemd160|readable-stream|regenerator-runtime|rtcpeerconnection-shim|stream-browserify|store|timers-browserify|tslib|unified|unist-util|util|vfile|vm-browserify|webrtc-adapter|whatwg-fetch|xxhashjs)/
          },
          vendor02: {
            chunks: 'initial',
            enforce: true,
            name: 'other.02',
            test: /node_modules\/(attr-accept|base-x|base64-js|blakejs|bip39|bip66|bn\.js|brorand|buffer|camelcase|cipher-base|core-js|core-util|create-|cuint|decode-uri|deep-equal|define-properties|detect-browser|es-abstract|es5-ext|es6-symbol|extend|function-bind|has-symbols|history|html-parse|ieee754|ip-|is-|minimalistic-crypto-utils|moment|next-tick|node-libs-browser|randombytes|randomfill|regexp|rxjs|safe-buffer|scheduler|sdp|secp256k1|setimmediate|sha\.js|through)/
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
