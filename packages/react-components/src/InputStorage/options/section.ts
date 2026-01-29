// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { DropdownOption, DropdownOptions } from '../../util/types.js';

export function sectionOptions (api: ApiPromise): DropdownOptions {
  return Object
    .keys(api.query)
    .filter((s) => !s.startsWith('$'))
    .sort()
    .filter((n) => Object.keys(api.query[n]).length)
    .map((value): DropdownOption => ({
      text: value,
      value
    }));
}
