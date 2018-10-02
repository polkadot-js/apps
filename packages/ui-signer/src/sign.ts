// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';
import { UInt } from '@polkadot/types/codec';
import { Signed } from './types';

// FIXME Pull in new extrinsics
// import encodeCall from '@polkadot/extrinsics/codec/encode/call';
// import prefixes from '@polkadot/extrinsics/codec/encode/prefixes';
import keyring from '@polkadot/ui-keyring/index';
import bnToU8a from '@polkadot/util/bn/toU8a';
import u8aConcat from '@polkadot/util/u8a/concat';
import u8aToHex from '@polkadot/util/u8a/toHex';

export default function signMessage (publicKey: Uint8Array, accountNonce: UInt | BN | number, value: Uint8Array): Signed {
  const message = new Uint8Array(); // encodeCall(publicKey, accountNonce, value, apiSupport);
  const signature = keyring.getPair(publicKey).sign(message);
  const data = u8aConcat(
    // prefixes.publicKey,
    message,
    signature
  );

  console.log(`signMessage :   message :: ${u8aToHex(message)}`);
  console.log(`signMessage : signature :: ${u8aToHex(signature)}`);
  console.log(`signMessage :      data :: ${u8aToHex(data)}`);

  return {
    data: u8aConcat(
      bnToU8a(data.length, 32, true),
      data
    ),
    message,
    signature
  };
}
