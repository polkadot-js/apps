// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Generator$PkFromSeed, Generator$Matches, Generator$Result, Generator$Options } from './types';

const generate = require('./generate');

module.exports = function generator (options: Generator$Options, pkFromSeed?: Generator$PkFromSeed): Generator$Result {
  const { match, runs = 10, withCase = false } = options;
  const test = withCase
    ? match.split('')
    : match.toLowerCase().split('');
  const startAt = Date.now();
  const found: Generator$Matches = [];

  while (found.length !== runs) {
    found.push(generate(test, options, pkFromSeed));
  }

  return {
    elapsed: Date.now() - startAt,
    found
  };
};
