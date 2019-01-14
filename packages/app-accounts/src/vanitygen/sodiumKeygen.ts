// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Generator$PkFromSeed } from './types';

import { bufferToU8a, u8aToBuffer } from '@polkadot/util';

export default function setupFn (sodium: any): Generator$PkFromSeed {
  return (seed: Uint8Array): Uint8Array =>
    bufferToU8a(
      sodium.crypto_sign_seed_keypair(
        u8aToBuffer(seed)
      ).publicKey
    );
}
