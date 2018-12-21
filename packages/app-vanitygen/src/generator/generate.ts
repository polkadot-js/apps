// Copyright 2017-2018 @polkadot/app-vanitygen authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Generator$PkFromSeed, Generator$Match, Generator$Options } from './types';

import sodiumWasm from 'libsodium-wrappers';
import { encodeAddress } from '@polkadot/keyring';
import { naclKeypairFromSeed, randomAsU8a } from '@polkadot/util-crypto';

import calculate from './calculate';
import sodiumKeygen from './sodiumKeygen';

const tweetPkFromSeed = (seed: Uint8Array): Uint8Array =>
  naclKeypairFromSeed(seed).publicKey;

let defaultPkFromSeed: Generator$PkFromSeed = tweetPkFromSeed;

// tslint:disable-next-line
(async () => {
  try {
    await sodiumWasm.ready;

    defaultPkFromSeed = sodiumKeygen(sodiumWasm);
  } catch (error) {
    console.log(`Using NaCl bindings from 'tweet-nacl' (faster 'libsodium-wrappers' dependency not available)`);
  }
})();

export default function generator (test: Array<string>, options: Generator$Options, pkFromSeed: Generator$PkFromSeed = defaultPkFromSeed): Generator$Match {
  const seed = randomAsU8a();
  const address = encodeAddress(pkFromSeed(seed));
  const { count, offset } = calculate(test, address, options);

  return {
    address,
    count,
    offset,
    seed
  };
}
