// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Calls } from './types';

const bnToU8a = require('@polkadot/util/bn/toU8a');
const u8aConcat = require('@polkadot/util/u8a/concat');

const consensus = require('./consensus');
const council = require('./council');
const councilVoting = require('./councilVoting');
const democracy = require('./democracy');
const session = require('./session');
const staking = require('./staking');

const calls = {
  consensus, // 0
  session, // 1
  staking, // 2
  democracy, // 3
  council, // 4
  councilVoting // 5
};

const flattenned: Calls = Object
  .keys(calls)
  .reduce((flat, sectionName, index) => {
    const section = calls[sectionName];
    const sectionIndex = bnToU8a(index, 8);

    Object
      .keys(section)
      .reduce((flat, method, index) => {
        const name = `${sectionName}_${method}`;
        const methodIndex = bnToU8a(index, 8);

        flat[name] = section[method];
        flat[name].index = u8aConcat(sectionIndex, methodIndex);

        return flat;
      }, flat);

    return flat;
  }, ({}: $Shape<FlatCalls>));

module.exports = flattenned;
