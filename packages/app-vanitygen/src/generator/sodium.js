// Copyright 2017-2018 @polkadot/app-vanitygen authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

const bufferToU8a = require('@polkadot/util/buffer/toU8a');
const u8aToBuffer = require('@polkadot/util/u8a/toBuffer');

let pkFromSeed = void 0;

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

module.exports = {
  pkFromSeed
};
