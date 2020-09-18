// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { KeyringItemType } from '@polkadot/ui-keyring/types';

import getAddressMeta from './getAddressMeta';

export default function getAddressTags (address: string, type: KeyringItemType | null = null): string[] {
  return getAddressMeta(address, type).tags as string[] || [];
}
