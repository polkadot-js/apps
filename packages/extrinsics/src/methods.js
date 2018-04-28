// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic, ExtrinsicBase, ExtrinsicsBaseSection, ExtrinsicSectionName } from './types';

const bnToU8a = require('@polkadot/util/bn/toU8a');
const u8aConcat = require('@polkadot/util/u8a/concat');

const TYPES = ['private', 'public'];

module.exports = function expandMethods (sectionSource: ExtrinsicsBaseSection, sectionName: ExtrinsicSectionName, sectionIndex: Uint8Array): Array<Extrinsic> {
  const [priMethods, pubMethods] = TYPES.map((type) => {
    const isPrivate = type === 'private';
    const methods = sectionSource.methods[type];

    return methods.map(({ description, index, name, params }: ExtrinsicBase): Extrinsic => {
      return {
        description,
        index: u8aConcat(sectionIndex, bnToU8a(index, 8)),
        isPrivate,
        name: `${sectionName}_${name}`,
        params
      };
    });
  });

  return [].concat(priMethods, pubMethods);
};
