// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DropdownOptions } from '@canvas-ui/react-util/types';

import ApiPromise from '@polkadot/api/promise';

export default function createOptions (api: ApiPromise): DropdownOptions {
  return Object
    .keys(api.query)
    .sort()
    .filter((name): number => Object.keys(api.query[name]).length)
    .map((name): { text: string; value: string } => ({
      text: name,
      value: name
    }));
}
