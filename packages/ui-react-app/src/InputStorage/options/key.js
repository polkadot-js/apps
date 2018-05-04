// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { StateDb$SectionNames } from '@polkadot/storage/types';

import map from '@polkadot/storage-substrate/keys';

import createItemOptions from '../../RxDrodownLinked/createItemOptions';

export default function createOptions (sectionName: StateDb$SectionNames): Array<*> {
  return createItemOptions(map[sectionName].keys);
}
