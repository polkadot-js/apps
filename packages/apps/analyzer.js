#!/usr/bin/env node

process.env.NODE_ENV = 'production';

const Analyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpackConfig = require('react-scripts/config/webpack.config.prod');

webpackConfig.plugins.push(
  new Analyzer({
    analyzerMode: 'static',
    reportFilename: 'report.html'
  })
);

require('react-scripts/scripts/build');
