// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic$Param } from '@polkadot/extrinsics/types';

const bnToU8a = require('@polkadot/util/bn/toU8a');
const u8aToU8a = require('@polkadot/util/u8a/toU8a');

// flowlint-next-line unclear-type:off
module.exports = function encodeParam (param: Extrinsic$Param, value: any): Uint8Array {
  try {
    switch (param.type) {
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
        return value;
    }
  } catch (error) {
    console.error(error, 'with', value, 'encoded with', param);

    throw error;
  }
};
