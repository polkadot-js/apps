// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Call$Params } from '../../calls/types';

const u8aConcat = require('@polkadot/util/u8a/concat');

const encodeParam = require('./param');

// flowlint-next-line unclear-type:off
module.exports = function encodeParams (values: Array<mixed>, params: Call$Params): Uint8Array {
  return u8aConcat.apply(null, values.map((value, index) => {
    return encodeParam(value, params[index]);
  }));
};
