// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ExtrinsicsBaseMethods$Map, ExtrinsicMethods$Map, ExtrinsicSectionName } from './types';

const bnToU8a = require('@polkadot/util/bn/toU8a');
const u8aConcat = require('@polkadot/util/u8a/concat');

module.exports = function expandMethods (methods: ExtrinsicsBaseMethods$Map, sectionName: ExtrinsicSectionName, sectionIndex: Uint8Array): ExtrinsicMethods$Map {
  return Object
    .keys(methods)
    .reduce((result: ExtrinsicMethods$Map, name: string) => {
      const { description, index, params } = methods[name];

      result[name] = {
        description,
        index: u8aConcat(sectionIndex, bnToU8a(index, 8)),
        name: `${sectionName}_${name}`,
        params
      };

      return result;
    }, {});
};
