// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

// TODO: Move to API

import type BN from 'bn.js';
import type { Extrinsic } from '../extrinsics/types';

const encodeCall = require('./call');
const encodeExtrinsic = require('./extrinsic');

module.exports = function encode (extrinsic: Extrinsic, publicKey: Uint8Array, nonce: number | BN, values?: Array<mixed>): Uint8Array {
  return encodeCall(
    publicKey,
    nonce,
    encodeExtrinsic(extrinsic, values)
  );
};
