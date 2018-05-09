// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Generator$Match, Generator$Matches, Generator$Result, Generator$Options } from './types';

const chalk = require('chalk');
const u8aToHex = require('@polkadot/util/u8a/toHex');

const generate = require('./generate');

module.exports = function generator (options: Generator$Options): Generator$Result {
  const { match, runs = -1, withCase = false } = options;
  const test = withCase
    ? match.split('')
    : match.toLowerCase().split('');
  const startAt = Date.now();
  const found: Generator$Matches = [];
  let best: $Shape<Generator$Match> = { count: -1 };
  let total = 0;

  while (found.length !== runs) {
    const match = generate(test, options);

    if (runs !== -1) {
      found.push(match);
    } else if ((match.count > best.count) || ((match.count === best.count) && (match.offset < best.offset))) {
      best = match;
    }

    total++;

    if ((runs === -1) && ((total % 1000) === 0)) {
      const elapsed = Date.now() - startAt;
      const { address, count, offset, seed } = best;

      console.log(`${total} in ${(elapsed / 1000).toFixed(2)}s, ${(elapsed / total).toFixed(3)}ms/key, count=${count}, offset=${offset} :: ${address.slice(0, offset)}${chalk.cyan(address.slice(offset, count + offset))}${address.slice(count + offset)} <= ${u8aToHex(seed)}`);
    }
  }

  return {
    elapsed: Date.now() - startAt,
    found
  };
};
