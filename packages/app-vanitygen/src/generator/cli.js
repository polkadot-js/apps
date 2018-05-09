#!/usr/bin/env node
// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

const yargs = require('yargs');
const chalk = require('chalk');
const u8aToHex = require('@polkadot/util/u8a/toHex');

const generator = require('./index.js');
const { pkFromSeed } = require('./sodium');

const { match, withCase } = yargs
  .option('match', {
    default: 'EEEEE'
  })
  .option('withCase', {
    default: true
  })
  .argv;

const INDICATORS = ['|', '/', '-', '\\'];
const NUMBER_REGEX = /(\d+?)(?=(\d{3})+(?!\d)|$)/g;

const options = {
  match,
  runs: 50,
  withCase
};
const startAt = Date.now();
let best = { count: -1 };
let total = 0;
let indicator = -1;

console.log(options);

function showProgress () {
  const elapsed = (Date.now() - startAt) / 1000;

  indicator++;

  if (indicator === INDICATORS.length) {
    indicator = 0;
  }

  process.stdout.write(`\r[${INDICATORS[indicator]}] ${total.toString().match(NUMBER_REGEX).join(',')} keys in ${(elapsed).toFixed(2)}s (${(total / elapsed).toFixed(0)} keys/s)`);
}

function showBest () {
  const { address, count, offset, seed } = best;

  console.log(`\r::: ${address.slice(0, offset)}${chalk.cyan(address.slice(offset, count + offset))}${address.slice(count + offset)} <= ${u8aToHex(seed)} (count=${count}, offset=${offset})`);
}

while (true) {
  const nextBest = generator(options, pkFromSeed).found.reduce((best, match) => {
    if ((match.count > best.count) || ((match.count === best.count) && (match.offset < best.offset))) {
      return match;
    }

    return best;
  }, best);

  total += options.runs;

  if (nextBest.address !== best.address) {
    best = nextBest;
    showBest();
    showProgress();
  } else if ((total % 1000) === 0) {
    showProgress();
  }
}
