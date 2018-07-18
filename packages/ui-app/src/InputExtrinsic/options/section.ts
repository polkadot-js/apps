// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Extrinsic$Sections } from '@polkadot/extrinsics/types';

import { DropdownOptions } from '../types';

import map from '@polkadot/extrinsics';

function anyMethodToDisplay (methods: any) {
  return Object
    .keys(methods)
    .filter((name) => {
      const { isDeprecated, isHidden } = methods[name];

      return !isDeprecated && !isHidden;
    })
    .length !== 0;
}

function shouldDisplaySection (section: any, methods: any) {
  return !section.isDeprecated && !section.isHidden && anyMethodToDisplay(methods);
}

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

      return shouldDisplaySection(section, methods);
    })
    .map((name) => ({
      text: name,
      value: name
    }));
}
