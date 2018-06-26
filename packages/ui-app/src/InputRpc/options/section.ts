// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Interface$Sections } from '@polkadot/jsonrpc/types';

import { DropdownOptions } from '../../InputExtrinsic/types';

import map from '@polkadot/jsonrpc';

export default function createOptions (): DropdownOptions {
  return Object
    .keys(map)
    .sort()
    .filter((name) => {
      const section = map[name as Interface$Sections];

      // cannot really get here
      if (!section) {
        return false;
      }

      const { isDeprecated } = section;
      const available = Object
        .keys(section.public)
        .filter((name) => {
          const { isDeprecated, isHidden } = section.public[name];

          return !isDeprecated && !isHidden;
        });

      return !isDeprecated && available.length !== 0;
    })
    .map((name) => ({
      text: name,
      value: name
    }));
}
