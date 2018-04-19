// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic$Params } from '../extrinsics/types';

const u8aConcat = require('@polkadot/util/u8a/concat');

const encodeParam = require('./param');

module.exports = function encodeParams (values: Array<mixed>, params: Extrinsic$Params): Uint8Array {
  return u8aConcat.apply(null, values.map((value, index) => {
    return encodeParam(value, params[index]);
  }));
};
