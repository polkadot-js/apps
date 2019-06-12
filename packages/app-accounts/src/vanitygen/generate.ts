// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Generator$Match, Generator$Options } from './types';

import { encodeAddress, naclKeypairFromSeed, randomAsU8a, schnorrkelKeypairFromSeed } from '@polkadot/util-crypto';

import calculate from './calculate';

export default function generator (test: Array<string>, options: Generator$Options): Generator$Match {
  const seed = randomAsU8a();
  const pair = options.type === 'sr25519'
    ? schnorrkelKeypairFromSeed(seed)
    : naclKeypairFromSeed(seed);
  const address = encodeAddress(pair.publicKey);
  const { count, offset } = calculate(test, address, options);

  return {
    address,
    count,
    offset,
    seed
  };
}
