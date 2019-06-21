// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringItemType } from '@polkadot/ui-keyring/types';

import getAddressMeta from './getAddressMeta';
import toShortAddress from './toShortAddress';

export default function getAddressName (address: string, type: KeyringItemType | null = null, withShort?: boolean, defaultName?: string): string | undefined {
  const meta = getAddressMeta(address, type);
  const name = meta.name || defaultName;

  return !name && withShort
    ? toShortAddress(address)
    : name;
}
