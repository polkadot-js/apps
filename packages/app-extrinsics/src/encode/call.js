// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

// TODO: Move to API

import type BN from 'bn.js';

const bnToU8a = require('@polkadot/util/bn/toU8a');
const u8aConcat = require('@polkadot/util/u8a/concat');

module.exports = function encodeCall (publicKey: Uint8Array, nonce: number | BN, data: Uint8Array): Uint8Array {
  return u8aConcat(
    publicKey,
    bnToU8a(nonce, 64, true),
    data
  );
};
