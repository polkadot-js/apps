// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DropdownOptions } from '../../util/types';

import ApiPromise from '@polkadot/api/promise';

export default function createOptions (apiPromise: ApiPromise): DropdownOptions {
  return Object
    .keys(apiPromise.tx)
    .sort()
    .map((name) => ({
      text: name,
      value: name
    }));
}
