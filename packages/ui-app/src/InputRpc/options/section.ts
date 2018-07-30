// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Interface$Sections } from '@polkadot/jsonrpc/types';
import { DropdownOptions } from '../../util/types';
import { shouldDisplaySection } from '../../util/shouldDisplaySection';

import map from '@polkadot/jsonrpc';

export default function createOptions (): DropdownOptions {
  return Object
    .keys(map)
    .sort()
    .filter((name) => {
      const section = map[name as Interface$Sections];

      return shouldDisplaySection(section, 'public');
    })
    .map((name) => ({
      text: name,
      value: name
    }));
}
