// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Extrinsic$Sections } from '@polkadot/extrinsics/types';

import { DropdownOptions } from '../types';

import map from '@polkadot/extrinsics';

export default function createOptions (type: 'private' | 'public'): DropdownOptions {
  return Object
    .keys(map)
    .sort()
    .filter((name) => {
      const section = map[name as Extrinsic$Sections];

      // cannot really get here
      if (!section) {
        return false;
      }

      const methods = section[type];

      return Object.keys(methods).length !== 0;
    })
    .map((name) => ({
      text: name,
      value: name
    }));
}
