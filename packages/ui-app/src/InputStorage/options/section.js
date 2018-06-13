// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { DropdownOptions } from '../../InputExtrinsic/types';

import map from '@polkadot/storage';

export default function createOptions (): DropdownOptions {
  return Object
    .keys(map)
    .sort()
    .filter((name) => {
      const section = map[name];
      const methods = Object
        .keys(section.public)
        .filter((name) => {
          const { isDeprecated, isHidden } = section.public[name];

          return !isDeprecated && !isHidden;
        });

      return !section.isDeprecated && methods.length !== 0;
    })
    .map((name) => ({
      text: name,
      value: name
    }));
}
