// Copyright 2017-2018 @polkadot/app-vanitygen authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Generator$PkFromSeed, Generator$Match, Generator$Options } from './types';

import randomBytes from '@polkadot/util-crypto/random/asU8a';
import addressEncode from '@polkadot/util-keyring/address/encode';
import pairFromSeed from '@polkadot/util-crypto/nacl/keypair/fromSeed';

import calculate from './calculate';

const tweetPkFromSeed = (seed: Uint8Array): Uint8Array =>
  pairFromSeed(seed).publicKey;

export default function generator (test: Array<string>, options: Generator$Options, pkFromSeed: Generator$PkFromSeed = tweetPkFromSeed): Generator$Match {
  const seed = randomBytes();
  const address = addressEncode(pkFromSeed(seed));
  const { count, offset } = calculate(test, address, options);

  return {
    address,
    count,
    offset,
    seed
  };
}
