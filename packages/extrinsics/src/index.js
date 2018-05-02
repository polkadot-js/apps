// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsics, ExtrinsicsBaseMap, ExtrinsicSectionName } from './types';

const bnToU8a = require('@polkadot/util/bn/toU8a');

const expandMethods = require('./methods');

// NOTE: Order here is important, counts as an index
const BASIC_KEYS: Array<ExtrinsicSectionName> = ['consensus', 'session', 'staking', 'democracy', 'council', 'councilVoting'];

module.exports = function init (baseMap: ExtrinsicsBaseMap): Extrinsics {
  return BASIC_KEYS.reduce((extrinsics: Extrinsics, name: ExtrinsicSectionName, sectionIndex: number) => {
    const section = baseMap[name];

    if (section) {
      const { description, methods } = section;
      const index = bnToU8a(sectionIndex, 8);

      extrinsics[name] = {
        description: description || name,
        index,
        methods: {
          private: expandMethods(methods.private, name, index),
          public: expandMethods(methods.public, name, index)
        },
        name
      };
    }

    return extrinsics;
  }, {});
};
