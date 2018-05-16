// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const apps = ['accounts', 'addresses', 'explorer', 'extrinsics', 'storage', 'toolbox', 'vanitygen'];
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  context: __dirname,
  devtool: isProd ? 'source-map' : false,
  entry: './src/index.js',
  mode: isProd ? 'production' : 'development',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'static/js/bundle.[hash:8].js'
  },
  resolve: {
    alias: apps.reduce((alias, app) => {
      app[`@polkadot/app-${app}`] = path.resolve(__dirname, `../app-${app}/src`);

      return alias;
    }, {})
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
              ident: 'postcss'
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
        test: /\.js$/,
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
              name: 'static/media/[name].[hash:8].[ext]'
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
              name: 'static/media/[name].[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  performance: {
    hints: false
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(__dirname, 'public/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/bundle.[hash:8].css'
    })
  ]
};
