// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import keyring from '@polkadot/ui-keyring';
import { KeyringItemType } from '@polkadot/ui-keyring/types';

export default function getAddressTags (address: string, type: KeyringItemType | null = null): Array<string> {
  let pair;

  try {
    pair = keyring.getAddress(address, type);
  } catch (error) {
    // all-ok, we have empty fallbacks
  }

  return (pair && pair.isValid() && pair.getMeta().tags) || [];
}
