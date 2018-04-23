// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

// TODO: Move to API

import type { Extrinsic, Extrinsics, ExtrinsicsBasic, ExtrinsicsMap, ExtrinsicSection } from './types';

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
const sectionNames = Object.keys(map);
const extrinsics: Extrinsics = ({
  sections: []
}: $Shape<Extrinsics>);
const extrinsicsMap: ExtrinsicsMap = {};

sectionNames.reduce((sections: Array<ExtrinsicSection>, sectionName: string, _index) => {
  const sectionSource = map[sectionName];
  const sectionIndex = bnToU8a(_index, 8);
  const methodNames = Object.keys(sectionSource.methods);

  if (!methodNames.length) {
    return sections;
  }

  const section: ExtrinsicSection = {
    description: sectionSource.description,
    methods: [],
    name: sectionName
  };

  methodNames.reduce((methods: Array<Extrinsic>, methodName: string) => {
    const methodSource = sectionSource.methods[methodName];
    const name = `${sectionName}_${methodName}`;
    const index = u8aConcat(sectionIndex, bnToU8a(methodSource.index, 8));
    const method: Extrinsic = {
      description: methodSource.description,
      index,
      name,
      params: methodSource.params
    };

    methods.push(method);
    extrinsicsMap[name] = method;

    return methods;
  }, section.methods);

  sections.push(section);

  return sections;
}, extrinsics.sections);

extrinsics.get = function get (sectionMethod: string): Extrinsic {
  return extrinsicsMap[sectionMethod];
};

module.exports = extrinsics;
