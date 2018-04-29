// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic$Param } from '@polkadot/extrinsics/types';

const u8aConcat = require('@polkadot/util/u8a/concat');
const bnToU8a = require('@polkadot/util/bn/toU8a');

const encodeType = require('./type');

// flowlint-next-line unclear-type:off
module.exports = function encodeParam (param: Extrinsic$Param, value: any): Uint8Array {
  if (Array.isArray(param.type)) {
    const [outer, inner] = param.type;

    switch (outer) {
      case 'Array':
        return u8aConcat(
          bnToU8a((value: Array<*>).length, 32, true),
          u8aConcat.apply(null, (value: Array<*>).map((v) =>
            encodeType(inner, v)
          ))
        );

      default:
        return encodeType(inner, value);
    }
  }
  return encodeType(param.type, value);
};
