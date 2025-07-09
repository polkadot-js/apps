// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringItemType } from '@polkadot/ui-keyring/types';

import { getAddressMeta } from './getAddressMeta.js';

export function getAddressTags (address: string, type: KeyringItemType | null = null): string[] {
  return getAddressMeta(address, type).tags || [];
}
