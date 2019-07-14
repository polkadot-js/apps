// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { GeneratorMatch, GeneratorOptions } from './types';

import { encodeAddress, mnemonicGenerate, naclKeypairFromSeed, randomAsU8a, schnorrkelKeypairFromSeed, mnemonicToMiniSecret } from '@polkadot/util-crypto';

import calculate from './calculate';

export default function generator (test: string[][], options: GeneratorOptions): GeneratorMatch {
  const mnemonic = options.withHex
    ? undefined
    : mnemonicGenerate(12);
  const seed = mnemonic
    ? mnemonicToMiniSecret(mnemonic)
    : randomAsU8a();
  const pair = options.type === 'sr25519'
    ? schnorrkelKeypairFromSeed(seed)
    : naclKeypairFromSeed(seed);
  const address = encodeAddress(pair.publicKey);
  const { count, offset } = calculate(test, address, options);

  return {
    address,
    count,
    mnemonic,
    offset,
    seed
  };
}
