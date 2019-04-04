// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Generator$Match, Generator$Options } from './types';

import { encodeAddress } from '@polkadot/keyring';
import { naclKeypairFromSeed, randomAsU8a } from '@polkadot/util-crypto';

import calculate from './calculate';

export default function generator (test: Array<string>, options: Generator$Options): Generator$Match {
  const seed = randomAsU8a();
  const address = encodeAddress(naclKeypairFromSeed(seed).publicKey);
  const { count, offset } = calculate(test, address, options);

  return {
    address,
    count,
    offset,
    seed
  };
}
