// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { QueueTx$Extrinsic, Signed } from '../types';

import encodeCall from '@polkadot/extrinsics-codec/encode/call';
import keyring from '@polkadot/ui-keyring';
import u8aConcat from '@polkadot/util/u8a/concat';
import u8aToHex from '@polkadot/util/u8a/toHex';

export default function sign ({ nonce, publicKey, value }: QueueTx$Extrinsic): Signed {
  const message = encodeCall(publicKey, nonce, value);
  const signature = keyring.getPair(publicKey).sign(message);

  console.log(`  message :: ${u8aToHex(message)}`);
  console.log(`signature :: ${u8aToHex(signature)}`);

  return {
    data: u8aConcat(message, signature),
    message,
    signature
  };
}
