#!/usr/bin/env node
// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

const yargs = require('yargs');
const generator = require('./index.js');

const argv = yargs
  .option('match', {
    alias: 'm',
    default: 'EEEEE'
  })
  .argv;

generator({
  match: argv.match
});
