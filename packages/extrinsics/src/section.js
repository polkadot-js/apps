// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ExtrinsicSectionName, ExtrinsicsBaseSection, ExtrinsicSection } from './types';

const bnToU8a = require('@polkadot/util/bn/toU8a');

const expandMethods = require('./methods');

module.exports = function mapSection (sectionSource: ExtrinsicsBaseSection, sectionName: ExtrinsicSectionName, sectionIndex: number): ExtrinsicSection {
  const index = bnToU8a(sectionIndex, 8);
  const methods = expandMethods(sectionSource, sectionName, index);

  return {
    description: sectionSource.description,
    hasPrivate: !!sectionSource.methods.private.length,
    hasPublic: !!sectionSource.methods.public.length,
    index,
    methods,
    name: sectionName
  };
};
