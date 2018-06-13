// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type BN from 'bn.js';
import type { EncodingVersions } from '@polkadot/params/types';
import type { Signed } from './types';

import encodeCall from '@polkadot/extrinsics-codec/encode/call';
import keyring from '@polkadot/ui-keyring';
import u8aConcat from '@polkadot/util/u8a/concat';
import u8aToHex from '@polkadot/util/u8a/toHex';

export default function signMessage (publicKey: Uint8Array, nonce: BN | number, value: Uint8Array, apiSupport: EncodingVersions): Signed {
  const message = encodeCall(publicKey, nonce, value, apiSupport);
  const signature = keyring.getPair(publicKey).sign(message);

  console.log(`signMessage :   message :: ${u8aToHex(message)}`);
  console.log(`signMessage : signature :: ${u8aToHex(signature)}`);

  return {
    data: u8aConcat(message, signature),
    message,
    signature
  };
}
