// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

// TODO: Move to API

import type { Extrinsics, ExtrinsicsBasic } from './types';

const bnToU8a = require('@polkadot/util/bn/toU8a');
const u8aConcat = require('@polkadot/util/u8a/concat');
const u8aToHex = require('@polkadot/util/u8a/toHex');

const consensus = require('./consensus');
const council = require('./council');
const councilVoting = require('./councilVoting');
const democracy = require('./democracy');
const session = require('./session');
const staking = require('./staking');

const all: { [string]: ExtrinsicsBasic } = {
  consensus, // 0
  session, // 1
  staking, // 2
  democracy, // 3
  council, // 4
  councilVoting // 5
};

const flattenned: Extrinsics = Object
  .keys(all)
  .reduce((flat, sectionName, _index) => {
    const section = all[sectionName];
    const sectionIndex = bnToU8a(_index, 8);

    Object
      .keys(section)
      .reduce((flat, method, _index) => {
        const name = `${sectionName}_${method}`;
        const methodIndex = bnToU8a(_index, 8);
        const index = u8aConcat(sectionIndex, methodIndex);
        const indexHex = u8aToHex(index, 16);
        const expanded = Object.assign(({
          index,
          indexHex,
          name
        }: $Shape<Extrinsic>), section[method]);

        flat[name] = expanded;

        return flat;
      }, flat);

    return flat;
  }, ({}: $Shape<Extrinsics>));

module.exports = flattenned;
