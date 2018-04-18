// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

// TODO: Move to API

import type BN from 'bn.js';
import type { Call } from '../calls/types';

const bnToU8a = require('@polkadot/util/bn/toU8a');
const u8aConcat = require('@polkadot/util/u8a/concat');
const u8aToHex = require('@polkadot/util/u8a/toHex');

const encodeParams = require('./params');

// flowlint-next-line unclear-type:off
module.exports = function encode (sender: KeyringPair, nonce: number | BN, { index, params }: Call, values: Array<mixed>) {
  const encodedParams = encodeParams(values, params);
  const message = u8aConcat(
    sender.publicKey(),
    bnToU8a(nonce, 64, true),
    index,
    encodedParams
  );
  const signature = sender.sign(message);

  console.log('message', u8aToHex(message));
  console.log('signature', u8aToHex(signature));

  return {
    message,
    signature
  };
};
