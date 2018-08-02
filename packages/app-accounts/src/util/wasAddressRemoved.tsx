// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { accountKey } from '@polkadot/ui-keyring/defaults';

// FIXME - does not force browser to refresh if account address removed from local storage
export default function wasAddressRemoved (address: string): boolean {
  const localStorageAccountKey = accountKey(address);

  return window.localStorage.getItem(localStorageAccountKey) === null;
}
