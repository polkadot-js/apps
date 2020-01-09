/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-var-requires */
// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { WebpackPluginServe } = require('webpack-plugin-serve');

const findPackages = require('../../scripts/findPackages');

const ENV = process.env.NODE_ENV || 'development';

function createWebpack ({ alias = {}, context, name = 'index' }) {
  const pkgJson = require(path.join(context, 'package.json'));
  const isProd = ENV === 'production';
  const hasPublic = fs.existsSync(path.join(context, 'public'));
  const plugins = hasPublic
    ? [new CopyWebpackPlugin([{ from: 'public' }])]
    : [];
  // disabled, smooths dev load, was -
  // isProd ? 'source-map' : 'cheap-eval-source-map',
  const devtool = false;

  return {
    context,
    devtool,
    entry: [
      '@babel/polyfill',
      `./src/${name}.tsx`,
      isProd
        ? null
        : null // 'webpack-plugin-serve/client'
    ].filter((entry) => entry),
    mode: ENV,
    output: {
      chunkFilename: '[name].[chunkhash:8].js',
      filename: '[name].[hash:8].js',
      globalObject: '(typeof self !== \'undefined\' ? self : this)',
      path: path.join(context, 'build')
    },
    resolve: {
      alias,
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          exclude: /(node_modules)/,
          use: [
            isProd
              ? MiniCssExtractPlugin.loader
              : require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1
              }
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                ident: 'postcss',
                plugins: () => [
                  require('precss'),
                  require('autoprefixer'),
                  require('postcss-simple-vars'),
                  require('postcss-nested'),
                  require('postcss-import'),
                  require('postcss-clean')(),
                  require('postcss-flexbugs-fixes')
                ]
              }
            }
          ]
        },
        {
          test: /\.css$/,
          include: /node_modules/,
          use: [
            isProd
              ? MiniCssExtractPlugin.loader
              : require.resolve('style-loader'),
            require.resolve('css-loader')
          ]
        },
        {
          test: /\.(js|ts|tsx)$/,
          exclude: /(node_modules)/,
          use: [
            require.resolve('thread-loader'),
            {
              loader: require.resolve('babel-loader'),
              options: require('@polkadot/dev-react/config/babel')
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
                limit: 10000,
                name: 'static/[name].[hash:8].[ext]',
                esModule: false
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
                name: 'static/[name].[hash:8].[ext]',
                esModule: false
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
          vendorOther: {
            chunks: 'initial',
            enforce: true,
            name: 'vendor',
            test: /node_modules\/(asn1|bn\.js|buffer|cuint|elliptic|lodash|moment|readable-stream|rxjs)/
          },
          vendorReact: {
            chunks: 'initial',
            enforce: true,
            name: 'react',
            test: /node_modules\/(chart|i18next|react|semantic-ui)/
          },
          polkadotJs: {
            chunks: 'initial',
            enforce: true,
            name: 'polkadotjs',
            test: /node_modules\/(@polkadot\/wasm-(crypto|dalek-ed25519|schnorrkel))/
          }
        }
      }
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
      new HtmlWebpackPlugin({
        inject: true,
        template: path.join(context, `${hasPublic ? 'public/' : ''}${name}.html`),
        PAGE_TITLE: 'Polkadot/Substrate Portal'
      }),
      new webpack.optimize.SplitChunksPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css'
      }),
      isProd
        ? null
        : new WebpackPluginServe({
          hmr: false, // switch off, Chrome WASM memory leak
          liveReload: false, // explict off, overrides hmr
          progress: false, // since we have hmr off, disable
          port: 3000,
          static: path.join(process.cwd(), '/build')
        })
    ]).filter((plugin) => plugin),
    watch: !isProd
  };
}

module.exports = createWebpack({
  context: __dirname,
  alias: findPackages().reduce((alias, { dir, name }) => {
    alias[name] = path.resolve(__dirname, `../${dir}/src`);

    return alias;
  }, {})
});
