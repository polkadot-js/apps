// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringInstance } from '@polkadot/util-keyring/types';
import type { KeyringOptions } from './types';

import testKeyring from '../keyring';
import createItem from './optionItem';

const cached: { [string]: ?KeyringOptions } = {
  addresses: null,
  accounts: null
};

export default function createOptions (isAddress?: boolean = false, keyring?: KeyringInstance = testKeyring, forceReload: boolean = false): KeyringOptions {
  const map = isAddress ? 'addresses' : 'accounts';

  if (forceReload || !cached[map]) {
    cached[map] = keyring
      .getPairs()
      .map((pair) => {
        const address = pair.address();
        const { name } = pair.getMeta();

        return createItem(address, name);
      });
  }

  // $FlowFixMe we have checked and set just above
  return cached[map];
}
