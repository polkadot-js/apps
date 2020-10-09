// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { KeyringItemType } from '@polkadot/ui-keyring/types';

import getAddressMeta from './getAddressMeta';
import toShortAddress from './toShortAddress';

// isName, isDefault, name
export default function getAddressName (address: string, type: KeyringItemType | null = null, defaultName?: string): [boolean, boolean, string, string] {
  const meta = getAddressMeta(address, type);
  const short = toShortAddress(address);

  return meta.name
    ? [false, false, meta.name.toUpperCase(), short]
    : defaultName
      ? [false, true, defaultName.toUpperCase(), short]
      : [true, false, short, short];
}
