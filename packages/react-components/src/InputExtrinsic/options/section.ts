// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { DropdownOptions } from '../../util/types.js';

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
