// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DropdownOptions } from '../../util/types';

import Api from '@polkadot/api-observable';

export default function createOptions (): DropdownOptions {
  return Object
    .keys(Api.extrinsics)
    .sort()
    .map((name) => ({
      text: name,
      value: name
    }));
}
