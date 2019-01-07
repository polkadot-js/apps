// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DropdownOptions } from '../../util/types';

import map from '@polkadot/jsonrpc';

export default function createOptions (): DropdownOptions {
  return Object
    .keys(map)
    .sort()
    .map((name) => ({
      text: name,
      value: name
    }));
}
