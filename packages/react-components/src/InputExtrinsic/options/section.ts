// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DropdownOptions } from '../../util/types';

import { ApiPromise } from '@polkadot/api';

export default function createOptions (api: ApiPromise, filter?: (section: string, method?: string) => boolean): DropdownOptions {
  return Object
    .keys(api.tx)
    .filter((s) =>
      !s.startsWith('$') &&
      (!filter || filter(s))
    )
    .sort()
    .filter((name): number => Object.keys(api.tx[name]).length)
    .map((name): { text: string; value: string } => ({
      text: name,
      value: name
    }));
}
