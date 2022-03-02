// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DropdownOption, DropdownOptions } from '../../util/types';

import { ApiPromise } from '@polkadot/api';

export function sectionOptions (api: ApiPromise): DropdownOptions {
  return Object
    .keys(api.query)
    .sort()
    .filter((n) => Object.keys(api.query[n]).length)
    .map((value): DropdownOption => ({
      text: value,
      value
    }));
}
