// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable camelcase */

const fs = require('fs');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const findPackages = require('../../scripts/findPackages.cjs');

function createWebpack (context, mode = 'production') {
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
    entry: './src/index.tsx',
    mode,
    module: {
      rules: [
        {
          scheme: 'data',
          type: 'asset/resource'
        },
        {
          include: /node_modules/,
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: require.resolve('css-loader'),
              options: {
                url: false
              }
            }
          ]
        },
        {
          exclude: /(node_modules)/,
          test: /\.(ts|tsx)$/,
          use: [
            {
              loader: require.resolve('ts-loader'),
              options: {
                configFile: 'tsconfig.webpack.json',
                transpileOnly: true
              }
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
      chunkIds: 'deterministic',
      concatenateModules: true,
      minimize: mode === 'production',
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: [
          // this one is massive (less-frequently updated, alongside deps)
          ['type', /[\\/]packages[\\/]apps-config[\\/]src[\\/]api[\\/]typesBundle/],
          // should just change when totally new teams are onboarded
          ['logo', /[\\/]packages[\\/]apps-config[\\/]src[\\/]ui[\\/]logos/],
          // config cannot go in main - it has multiple users
          ['conf', /[\\/]packages[\\/]apps-config[\\/]src[\\/]/],
          // exceptionally large - should not change at all
          ['robo', /[\\/]packages[\\/]react-components[\\/]src[\\/]IdentityIcon[\\/]RoboHash/],
          // library split (although it probably changes alongside pages)
          ['comm', /[\\/]packages[\\/]react-.*[\\/]src[\\/]/],
          // pages are seperated out (non-perfect, but indv. too small)
          ['page', /[\\/]packages[\\/]page-.*[\\/]src[\\/]/],
          // all other modules
          ['modu', /[\\/]node_modules[\\/]/]
        ].reduce((result, [name, test], index) => ({
          ...result,
          [`cacheGroup${index}`]: {
            chunks: 'initial',
            enforce: true,
            maxSize: 1_500_000,
            minSize: 0,
            name,
            priority: -1 * index,
            test
          }
        }), {})
      }
    },
    output: {
      // this is for dynamic imports
      chunkFilename: 'dyna.[contenthash].js',
      // this is via splitChunks
      filename: ({ chunk: { name } }) =>
        ['main', 'runtime'].includes(name)
          ? `${name === 'main' ? 'main' : 'load'}.[contenthash].js`
          : `${name.split('-')[0]}.[contenthash].js`,
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
          WS_URL: JSON.stringify(process.env.WS_URL)
        }
      }),
      new webpack.optimize.SplitChunksPlugin(),
      new MiniCssExtractPlugin({
        filename: 'extr.[contenthash].css'
      })
    ].concat(plugins),
    resolve: {
      alias,
      extensionAlias: {
        '.js': ['.js', '.ts', '.tsx']
      },
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
