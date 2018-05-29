// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Seeder } from './types';

const isU8a = require('@polkadot/util/is/u8a');
const u8aFromString = require('@polkadot/util/u8a/fromString');

const DIVISOR = 256 * 256;

module.exports = function seeder (_seed: string | Uint8Array = new Uint8Array(32)): Seeder {
  // $FlowFixMe type checking
  const seed: Uint8Array = isU8a(_seed)
    ? _seed
    // $FlowFixMe type has been determined
    : u8aFromString(_seed);

  let index = (seed[Math.floor(seed.length / 2)] % seed.length) - 1;

  const next = () => {
    index += 1;

    if (index === seed.length) {
      index = 0;
    }

    return seed[index];
  };

  return (): number => {
    return ((next() * 256) + next()) / DIVISOR;
  };
};
