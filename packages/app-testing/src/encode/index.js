// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

// TODO: Move to API

import type BN from 'bn.js';

const bnToU8a = require('@polkadot/util/bn/toU8a');
const u8aConcat = require('@polkadot/util/u8a/concat');

const extrinsics = require('../extrinsics');
const encodeParams = require('./params');

// flowlint-next-line unclear-type:off
module.exports = function encode (sender: KeyringPair, nonce: number | BN, method: string, values: Array<mixed>): Uint8Array {
  const { index, params } = extrinsics[method];
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
