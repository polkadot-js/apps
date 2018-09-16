// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const packages = [
  'app-accounts',
  'app-addresses',
  'app-democracy',
  'app-example',
  'app-explorer',
  'app-extrinsics',
  'app-rpc',
  'app-staking',
  'app-storage',
  'app-toolbox',
  'app-transfer',
  'app-vanitygen',
  'ui-app',
  'ui-identicon',
  'ui-keyring',
  'ui-react-rx',
  'ui-react',
  'ui-signer'
];

function createWebpack ({ alias = {}, context, name = 'index' }) {
  const pkgJson = require(path.join(context, 'package.json'));
  const ENV = process.env.NODE_ENV || 'development';
  const isProd = ENV === 'production';
  const hasPublic = fs.existsSync(path.join(context, 'public'));
  const plugins = hasPublic
    ? [new CopyWebpackPlugin([{ from: 'public' }])]
    : [];

  return {
    context,
    devtool: isProd ? 'source-map' : 'cheap-eval-source-map',
    entry: `./src/${name}.tsx`,
    mode: ENV,
    output: {
      path: path.join(context, 'build'),
      filename: `[name].[hash:8].js`,
      chunkFilename: `[name].[chunkhash:8].js`
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
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          use: [
            {
              loader: require.resolve('url-loader'),
              options: {
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
          vendorSodium: {
            chunks: 'initial',
            enforce: true,
            name: 'sodium',
            test: /node_modules\/(libsodium)/
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
          UI_MODE: JSON.stringify(process.env.UI_MODE || 'full'),
          UI_THEME: JSON.stringify(process.env.UI_THEME || 'polkadot'),
          WS_URL: JSON.stringify(process.env.WS_URL)
        }
      }),
      new HtmlWebpackPlugin({
        inject: true,
        template: path.join(context, `${hasPublic ? 'public/' : ''}${name}.html`),
        PAGE_TITLE: process.env.UI_THEME === 'substrate'
          ? 'Substrate Apps Portal'
          : 'Polkadot Apps Portal'
      }),
      new webpack.optimize.SplitChunksPlugin(),
      new MiniCssExtractPlugin({
        filename: `[name].[contenthash:8].css`
      })
    ])
  };
}

module.exports = createWebpack({
  context: __dirname,
  alias: packages.reduce((alias, pkg) => {
    alias[`@polkadot/${pkg}`] = path.resolve(__dirname, `../${pkg}/src`);

    return alias;
  }, {})
});
