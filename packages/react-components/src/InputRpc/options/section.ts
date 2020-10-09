// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DropdownOptions } from '../../util/types';

import ApiPromise from '@polkadot/api/promise';

export default function createOptions (api: ApiPromise): DropdownOptions {
  return Object
    .keys(api.rpc)
    .sort()
    .filter((section): boolean => Object.keys((api.rpc as Record<string, Record<string, unknown>>)[section]).length !== 0)
    .map((name): { text: string; value: string } => ({
      text: name,
      value: name
    }));
}
