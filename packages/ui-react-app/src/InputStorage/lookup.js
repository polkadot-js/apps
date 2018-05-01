// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { StateDb$SectionNames } from '@polkadot/storage/types';
import type { Lookup } from './types';

const keys = require('@polkadot/storage-substrate/keys');

const lookup = {};

Object
  .keys(keys)
  .forEach((sectionName: StateDb$SectionNames): Lookup => {
    const section = keys[sectionName];

    Object
      .keys(section)
      .forEach((methodName: string): void => {
        lookup[`${sectionName}_{methodName}`] = section[methodName];
      });
  });

module.exports = lookup;
