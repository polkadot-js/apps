// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DropdownOptions } from '../../util/types';

import { ApiPromise } from '@polkadot/api';

export default function createOptions (api: ApiPromise): DropdownOptions {
  return Object
    .keys(api.rpc)
    .filter((s) => !s.startsWith('$'))
    .sort()
    .filter((section) => Object.keys((api.rpc as unknown as Record<string, Record<string, unknown>>)[section]).length !== 0)
    .map((name): { text: string; value: string } => ({
      text: name,
      value: name
    }));
}
