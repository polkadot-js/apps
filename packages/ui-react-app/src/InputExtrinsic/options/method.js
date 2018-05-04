// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ExtrinsicSectionName } from '@polkadot/extrinsics/types';

import map from '@polkadot/extrinsics-substrate';

import createItemOptions from '../../RxDrodownLinked/createItemOptions';

type Creator = (sectionName: ExtrinsicSectionName) => Array<*>;

export default function createOptions (type: 'private' | 'public'): Creator {
  return (sectionName: ExtrinsicSectionName): Array<*> => {
    return createItemOptions(map[sectionName].methods[type]);
  };
}
