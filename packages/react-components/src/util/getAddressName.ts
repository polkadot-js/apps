// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringItemType } from '@polkadot/ui-keyring/types';

import { getAddressMeta } from './getAddressMeta.js';
// import { toShortAddress } from './toShortAddress.js';

// isName, isDefault, name
export function getAddressName (address: string, type: KeyringItemType | null = null, defaultName?: string): [boolean, boolean, string] {
  const meta = getAddressMeta(address, type);

  return meta.name
    ? [false, false, meta.name.toUpperCase()]
    : defaultName
      ? [false, true, defaultName.toUpperCase()]
      : [true, false, address]; // toShortAddress(address)];
}
