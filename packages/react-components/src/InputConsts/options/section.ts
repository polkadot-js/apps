// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DropdownOptions } from '../../util/types';

import { ApiPromise } from '@polkadot/api';

export default function createOptions (api: ApiPromise): DropdownOptions {
  return Object
    .keys(api.consts)
    .sort()
    .filter((name): number => Object.keys(api.consts[name]).length)
    .map((name): { text: string; value: string } => ({
      text: name,
      value: name
    }));
}
