// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic$Param } from '../extrinsics/types';

const bnToU8a = require('@polkadot/util/bn/toU8a');
const u8aToU8a = require('@polkadot/util/u8a/toU8a');

// flowlint-next-line unclear-type:off
module.exports = function encodeValue ({ type }: Extrinsic$Param, value: any): Uint8Array {
  switch (type) {
    case 'AccountId':
      return value;

    case 'Balance':
    case 'BlockNumber':
    case 'u64':
      return bnToU8a(value, 64, true);

    case 'Bytes':
      return u8aToU8a(value);

    case 'Proposal':
      return u8aToU8a(value);

    case 'u32':
      return bnToU8a(value, 32, true);

    default:
      throw new Error(`Unable to encode value with type '${type}'`);
  }
};
