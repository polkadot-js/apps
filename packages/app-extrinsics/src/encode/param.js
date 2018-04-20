// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic$Type } from '../extrinsics/types';

const bnToU8a = require('@polkadot/util/bn/toU8a');

// flowlint-next-line unclear-type:off
module.exports = function encodeValue (value: any, type: Extrinsic$Type): Uint8Array {
  switch (type) {
    case 'AccountId':
      return value;

    case 'Balance':
    case 'BlockNumber':
      return bnToU8a(value, 64, true);

    default:
      throw new Error(`Unable to encode value with type '${type}'`);
  }
};
