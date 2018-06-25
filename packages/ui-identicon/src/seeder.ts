// Copyright 2017-2018 @polkadot/ui-identicon authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Seeder } from './types';

import isU8a from '@polkadot/util/is/u8a';
import u8aFromString from '@polkadot/util/u8a/fromString';

const DIVISOR = 256 * 256;

export default function seeder (_seed: string | Uint8Array = new Uint8Array(32)): Seeder {
  const seed: Uint8Array = isU8a(_seed)
    ? _seed
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
