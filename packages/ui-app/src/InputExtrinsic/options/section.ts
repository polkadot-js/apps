// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Extrinsic$Sections } from '@polkadot/extrinsics/types';
import { DropdownOptions, SectionVisibilityAll } from '../../util/types';
import { shouldDisplaySection } from '../../util/shouldDisplaySection';

import map from '@polkadot/extrinsics';

export default function createOptions (type: SectionVisibilityAll): DropdownOptions {
  return Object
    .keys(map)
    .sort()
    .filter((name) => {
      const section = map[name as Extrinsic$Sections];

      return shouldDisplaySection(section, type);
    })
    .map((name) => ({
      text: name,
      value: name
    }));
}
