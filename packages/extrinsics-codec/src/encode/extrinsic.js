// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic } from '@polkadot/extrinsics/types';

const u8aConcat = require('@polkadot/util/u8a/concat');

const encodeParams = require('./params');

module.exports = function encodeExtrinsic (extrinsic: Extrinsic, values?: Array<mixed>): Uint8Array {
  if (!extrinsic) {
    return new Uint8Array([]);
  }

  return u8aConcat(
    extrinsic.index,
    encodeParams(extrinsic.params, values)
  );
};
