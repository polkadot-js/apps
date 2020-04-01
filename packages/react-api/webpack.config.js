// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const ENV = process.env.NODE_ENV || 'development';
const isProd = ENV === 'production';

module.exports = {
  context: __dirname,
  devtool: isProd ? 'source-map' : 'cheap-eval-source-map',
  entry: './src/demo.tsx',
  mode: ENV,
  module: {
    rules: [
      {
        exclude: /(node_modules)/,
        test: /\.(js|ts|tsx)$/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  output: {
    filename: './demo.js',
    path: __dirname
  },
  plugins: [],
  resolve: {
    alias: {},
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
};
