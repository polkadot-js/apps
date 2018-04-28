// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic$Params } from '@polkadot/extrinsics/types';

const u8aConcat = require('@polkadot/util/u8a/concat');

const encodeParam = require('./param');

module.exports = function encodeParams (params: Extrinsic$Params, values?: Array<mixed> = []): Uint8Array {
  return u8aConcat.apply(null, params.map((param, index) => {
    return encodeParam(param, values[index]);
  }));
};
