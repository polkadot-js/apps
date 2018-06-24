// Copyright 2017-2018 @polkadot/app-vanitygen authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import bufferToU8a from '@polkadot/util/buffer/toU8a';
import u8aToBuffer from '@polkadot/util/u8a/toBuffer';

type PkSeedFn = (seed: Uint8Array) => Uint8Array;

let pkFromSeed: PkSeedFn | undefined;

try {
  const sodium = require('sodium');

  pkFromSeed = (seed: Uint8Array): Uint8Array =>
    bufferToU8a(
      sodium.Key.Sign
        .fromSeed(u8aToBuffer(seed))
        .getPublicKey()
        .baseBuffer
    );
} catch (error) {
  console.log(`Using NaCl bindings from 'tweet-nacl' (faster 'sodium' dependency not installed)`);
}

export {
  pkFromSeed
};
