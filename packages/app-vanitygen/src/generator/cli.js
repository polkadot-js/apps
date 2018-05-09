#!/usr/bin/env node
// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

const yargs = require('yargs');
const chalk = require('chalk');
const u8aToHex = require('@polkadot/util/u8a/toHex');

const generator = require('./index.js');

const { match } = yargs
  .option('match', {
    alias: 'm',
    default: 'EEEEE'
  })
  .argv;

const options = {
  match,
  runs: 100
};
const startAt = Date.now();
let best = { count: -1 };
let total = 0;

while (true) {
  best = generator(options).found.reduce((best, match) => {
    if ((match.count > best.count) || ((match.count === best.count) && (match.offset < best.offset))) {
      return match;
    }

    return best;
  }, best);

  total += options.runs;

  if ((total % 1000) === 0) {
    const elapsed = Date.now() - startAt;
    const { address, count, offset, seed } = best;

    console.log(`${total} in ${(elapsed / 1000).toFixed(2)}s, ${(elapsed / total).toFixed(3)}ms/key, count=${count}, offset=${offset} :: ${address.slice(0, offset)}${chalk.cyan(address.slice(offset, count + offset))}${address.slice(count + offset)} <= ${u8aToHex(seed)}`);
  }
}
