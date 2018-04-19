// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

// TODO: Move to API

import type BN from 'bn.js';
import type { Extrinsic } from '../extrinsics/types';

const bnToU8a = require('@polkadot/util/bn/toU8a');
const u8aConcat = require('@polkadot/util/u8a/concat');

const encodeParams = require('./params');

module.exports = function encode (extrinsic: Extrinsic, sender: KeyringPair, nonce: number | BN, values: Array<mixed>): Uint8Array {
  const { index, params } = extrinsic;
  const encodedParams = encodeParams(values, params);
  const message = u8aConcat(
    sender.publicKey(),
    bnToU8a(nonce, 64, true),
    index,
    encodedParams
  );
  const signature = sender.sign(message);

  return u8aConcat(message, signature);
};
