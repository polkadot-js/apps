// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

// TODO: Move to API

import type { Extrinsic, Extrinsics, ExtrinsicBasic, ExtrinsicsBasic, ExtrinsicsMap, ExtrinsicSection } from './types';

const assert = require('@polkadot/util/assert');
const bnToU8a = require('@polkadot/util/bn/toU8a');
const u8aConcat = require('@polkadot/util/u8a/concat');

const consensus = require('./consensus');
const council = require('./council');
const councilVoting = require('./councilVoting');
const democracy = require('./democracy');
const session = require('./session');
const staking = require('./staking');

const map: { [string]: ExtrinsicsBasic } = {
  consensus, // 0
  session, // 1
  staking, // 2
  democracy, // 3
  council, // 4
  councilVoting // 5
};
const extrinsicsMap: ExtrinsicsMap = {};
const extrinsics: Extrinsics = {
  sections: [],
  get: (method: string): Extrinsic => {
    const extrinsic = extrinsicsMap[method];

    assert(extrinsic, `Unable to retrieve extrinsic with name '${method}'`);

    return extrinsic;
  }
};

const sectionNames = Object.keys(map);

function mapMethods (sectionSource: ExtrinsicsBasic, section: ExtrinsicSection, isPrivate: boolean): void {
  const methods = sectionSource.methods[isPrivate ? 'private' : 'public'];

  methods.forEach(({ description, index, name, params }: ExtrinsicBasic) => {
    const method: Extrinsic = {
      description,
      index: u8aConcat(section.index, bnToU8a(index, 8)),
      isPrivate,
      name: `${section.name}_${name}`,
      params
    };

    extrinsicsMap[method.name] = method;
    section[isPrivate ? 'hasPrivate' : 'hasPublic'] = true;

    section.methods.push(method);
  });
}

sectionNames.reduce((sections: Array<ExtrinsicSection>, sectionName: string, index: number) => {
  const sectionSource = map[sectionName];

  const section: ExtrinsicSection = {
    description: sectionSource.description,
    hasPrivate: false,
    hasPublic: false,
    index: bnToU8a(index, 8),
    methods: [],
    name: sectionName
  };

  mapMethods(sectionSource, section, true);
  mapMethods(sectionSource, section, false);

  sections.push(section);

  return sections;
}, extrinsics.sections);

module.exports = extrinsics;
