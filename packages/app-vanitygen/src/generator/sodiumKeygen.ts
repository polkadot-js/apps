// Copyright 2017-2018 @polkadot/app-vanitygen authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Generator$PkFromSeed } from './types';

import bufferToU8a from '@polkadot/util/buffer/toU8a';
import u8aToBuffer from '@polkadot/util/u8a/toBuffer';

export default function setupFn (sodium: any): Generator$PkFromSeed {
  return (seed: Uint8Array): Uint8Array =>
    bufferToU8a(
      sodium.crypto_sign_seed_keypair(
        u8aToBuffer(seed)
      ).publicKey
    );
}
