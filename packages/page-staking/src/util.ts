// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveAccountInfo } from '@polkadot/api-derive/types';

import { ApiPromise } from '@polkadot/api';
import keyring from '@polkadot/ui-keyring';

export function checkVisibility (api: ApiPromise, address: string, filterName: string, withIdentity: boolean, accountInfo?: DeriveAccountInfo): boolean {
  let isVisible = false;
  const filterLower = filterName.toLowerCase();

  if (filterLower || withIdentity) {
    if (accountInfo) {
      const { accountId, accountIndex, identity, nickname } = accountInfo;

      if (!withIdentity && (accountId?.toString().includes(filterName) || accountIndex?.toString().includes(filterName))) {
        isVisible = true;
      } else if (api.query.identity && api.query.identity.identityOf) {
        isVisible = (!!identity?.display && identity.display.toLowerCase().includes(filterLower)) ||
          (!!identity?.displayParent && identity.displayParent.toLowerCase().includes(filterLower));
      } else if (nickname) {
        isVisible = nickname.toLowerCase().includes(filterLower);
      }
    }

    if (!isVisible) {
      const account = keyring.getAddress(address);

      isVisible = account?.meta?.name
        ? account.meta.name.toLowerCase().includes(filterLower)
        : false;
    }
  } else {
    isVisible = true;
  }

  return isVisible;
}
