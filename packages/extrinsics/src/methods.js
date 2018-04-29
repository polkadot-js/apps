// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic, ExtrinsicsBaseSection, ExtrinsicSectionName } from './types';

const bnToU8a = require('@polkadot/util/bn/toU8a');
const u8aConcat = require('@polkadot/util/u8a/concat');

const expandParams = require('./params');

const TYPES = ['private', 'public'];

module.exports = function expandMethods (sectionSource: ExtrinsicsBaseSection, sectionName: ExtrinsicSectionName, sectionIndex: Uint8Array): Array<Extrinsic> {
  const [priMethods, pubMethods] = TYPES.map((type) => {
    const isPrivate = type === 'private';
    const methods = sectionSource.methods[type];
    const methodNames = Object.keys(methods);

    return methodNames.map((name: string): Extrinsic => {
      const { description, index, params } = methods[name];

      return {
        description,
        index: u8aConcat(sectionIndex, bnToU8a(index, 8)),
        isPrivate,
        name: `${sectionName}_${name}`,
        params: expandParams(params)
      };
    });
  });

  return [].concat(priMethods, pubMethods);
};
