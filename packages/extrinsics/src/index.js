// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic, Extrinsics, ExtrinsicsBaseMap, ExtrinsicSectionName, ExtrinsicsMap, ExtrinsicSection } from './types';

const assert = require('@polkadot/util/assert');

const expandSection = require('./section');

// NOTE: Order here is important, counts as an index
const BASIC_KEYS: Array<ExtrinsicSectionName> = ['consensus', 'session', 'staking', 'democracy', 'council', 'councilVoting'];

module.exports = function init (baseMap: ExtrinsicsBaseMap): Extrinsics {
  const map: ExtrinsicsMap = {};

  const get = (method: string): Extrinsic => {
    const extrinsic = map[method];

    assert(extrinsic, `Unable to retrieve extrinsic with name '${method}'`);

    return extrinsic;
  };

  const sections: Array<ExtrinsicSection> = BASIC_KEYS.reduce((sections: Array<ExtrinsicSection>, sectionName: ExtrinsicSectionName, sectionIndex: number) => {
    const sectionSource = baseMap[sectionName];

    if (sectionSource) {
      const section = expandSection(sectionSource, sectionName, sectionIndex);

      section.methods.forEach((method) => {
        map[method.name] = method;
      });

      sections.push(section);
    }

    return sections;
  }, []);

  return {
    get,
    sections
  };
};
