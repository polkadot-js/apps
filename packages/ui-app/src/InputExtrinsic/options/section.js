// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { DropdownOptions } from '../types';

import map from '@polkadot/extrinsics';

export default function createOptions (type: 'private' | 'public'): DropdownOptions {
  return Object
    .keys(map)
    .sort()
    .filter((name) => {
      const methods = map[name][type];

      return Object.keys(methods).length !== 0;
    })
    .map((name) => ({
      text: name,
      value: name
    }));
}
