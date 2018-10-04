// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { DropdownOptions } from '../../util/types';

// FIXME Swap to dynamic via fromMetadata
import map from '@polkadot/storage/static';

export default function createOptions (): DropdownOptions {
  return Object
    .keys(map)
    .sort()
    .map((name) => ({
      text: name,
      value: name
    }));
}
