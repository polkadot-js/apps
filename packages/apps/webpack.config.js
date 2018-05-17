// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

const fs = require('fs');
const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const packages = ['app-accounts', 'app-addresses', 'app-explorer', 'app-extrinsics', 'app-storage', 'app-toolbox', 'app-vanitygen', 'ui-app', 'ui-keyring'];

function createWebpack ({ alias = {}, context, name = 'index' }) {
  const isProd = process.env.NODE_ENV === 'production';
  const hasPublic = fs.existsSync(path.join(context, 'public'));
  const plugins = hasPublic
    ? [new CopyWebpackPlugin([{ from: 'public' }])]
    : [];

  return {
    context,
    devtool: isProd ? 'source-map' : false,
    entry: `./src/${name}.js`,
    mode: isProd ? 'production' : 'development',
    output: {
      path: path.join(context, 'build'),
      filename: `${name}.[hash:8].js`
    },
    resolve: {
      alias
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
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    },
    performance: {
      hints: false
    },
    plugins: plugins.concat([
      new HtmlWebpackPlugin({
        inject: true,
        template: path.join(context, `${hasPublic ? 'public/' : ''}${name}.html`)
      }),
      new MiniCssExtractPlugin({
        filename: `${name}.[hash:8].css`
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
