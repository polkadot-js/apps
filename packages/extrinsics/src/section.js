// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ExtrinsicSectionName, ExtrinsicsBaseSection, ExtrinsicSection } from './types';

const bnToU8a = require('@polkadot/util/bn/toU8a');

const expandMethods = require('./methods');

module.exports = function expandSection (sectionSource: ExtrinsicsBaseSection, name: ExtrinsicSectionName, sectionIndex: number): ExtrinsicSection {
  const index = bnToU8a(sectionIndex, 8);

  return {
    description: sectionSource.description || name,
    hasPrivate: !!Object.keys(sectionSource.methods.private).length,
    hasPublic: !!Object.keys(sectionSource.methods.public).length,
    index,
    methods: expandMethods(sectionSource, name, index),
    name
  };
};
