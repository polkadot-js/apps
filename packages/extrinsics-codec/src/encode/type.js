// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic$TypeName } from '@polkadot/extrinsics/types';

const bnToU8a = require('@polkadot/util/bn/toU8a');
const u8aToU8a = require('@polkadot/util/u8a/toU8a');

// flowlint-next-line unclear-type:off
module.exports = function encodeType (type: Extrinsic$TypeName, value: any): Uint8Array {
  try {
    switch (type) {
      case 'AccountId':
        return value;

      case 'Balance':
      case 'BlockNumber':
      case 'u64':
        return bnToU8a(value, 64, true);

      case 'Bytes':
      case 'Hash':
        return u8aToU8a(value);

      case 'bool':
        return bnToU8a(value ? 1 : 0, 8, true);

      case 'Proposal':
        return u8aToU8a(value);

      case 'u32':
        return bnToU8a(value, 32, true);

      case 'VoteThreshold':
        return bnToU8a(value || 0, 8, true);

      default:
        return value;
    }
  } catch (error) {
    console.error(error, 'with', value, 'encoded with', type);

    throw error;
  }
};
