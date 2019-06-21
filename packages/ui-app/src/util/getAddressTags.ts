// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringItemType } from '@polkadot/ui-keyring/types';

import getAddressMeta from './getAddressMeta';

export default function getAddressTags (address: string, type: KeyringItemType | null = null): Array<string> {
  return getAddressMeta(address, type).tags || [];
}
