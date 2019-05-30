// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Generator$Matches, Generator$Result, Generator$Options } from './types';

import generate from './generate';

export default function generator (options: Generator$Options): Generator$Result {
  const { match, runs = 10, withCase = false } = options;
  const test = withCase
    ? match.split('')
    : match.toLowerCase().split('');
  const startAt = Date.now();
  const found: Generator$Matches = [];

  while (found.length !== runs) {
    found.push(generate(test, options));
  }

  return {
    elapsed: Date.now() - startAt,
    found
  };
}
