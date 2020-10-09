// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable camelcase */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackPluginServe } = require('webpack-plugin-serve');
const findPackages = require('../../scripts/findPackages');

function mapChunks (name, regs, inc) {
  return regs.reduce((result, test, index) => ({
    ...result,
    [`${name}${index}`]: {
      chunks: 'initial',
      enforce: true,
      name: `${name}.${`0${index + (inc || 0)}`.slice(-2)}`,
      test
    }
  }), {});
}

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
          exclude: [/semantic-ui-css/],
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
          exclude: [/semantic-ui-css/],
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
          ...mapChunks('polkadot', [
            /* 00 */ /node_modules\/@polkadot\/(wasm)/,
            /* 01 */ /node_modules\/(@polkadot\/(api|metadata|rpc|types))/,
            /* 02 */ /node_modules\/(@polkadot\/(extension|keyring|react|ui|util|vanitygen)|@acala-network|@edgeware|@laminar|@ledgerhq|@open-web3|@subsocial|@zondax|edgeware)/
          ]),
          ...mapChunks('react', [
            /* 00 */ /node_modules\/(@fortawesome)/,
            /* 01 */ /node_modules\/(@emotion|@semantic-ui-react|@stardust|classnames|chart\.js|codeflask|copy-to-clipboard|file-selector|file-saver|hoist-non-react|i18next|jdenticon|keyboard-key|mini-create-react|popper\.js|prop-types|qrcode-generator|react|remark-parse|semantic-ui|styled-components)/
          ]),
          ...mapChunks('other', [
            /* 00 */ /node_modules\/(@babel|ansi-styles|asn1|browserify|buffer|history|html-parse|inherit|lodash|memoizee|object|path-|parse-asn1|pbkdf2|process|public-encrypt|query-string|readable-stream|regenerator-runtime|repeat|rtcpeerconnection-shim|safe-buffer|stream-browserify|store|tslib|unified|unist-util|util|vfile|vm-browserify|webrtc-adapter|whatwg-fetch)/,
            /* 01 */ /node_modules\/(attr|brorand|camelcase|core|chalk|color|create|cuint|decode-uri|deep-equal|define-properties|detect-browser|es|event|evp|ext|function-bind|has-symbols|ieee754|ip|is|lru|markdown|minimalistic-|moment|next-tick|node-libs-browser|random|regexp|resolve|rxjs|scheduler|sdp|setimmediate|timers-browserify|trough)/,
            /* 03 */ /node_modules\/(base-x|base64-js|blakejs|bip|bn\.js|cipher-base|crypto|des\.js|diffie-hellman|elliptic|hash|hmac|js-sha3|md5|miller-rabin|ripemd160|secp256k1|sha\.js|xxhashjs)/
          ])
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
