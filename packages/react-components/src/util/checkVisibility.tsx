// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveAccountInfo } from '@polkadot/api-derive/types';

import { ApiPromise } from '@polkadot/api';
import keyring from '@polkadot/ui-keyring';

export default function checkVisibility (api: ApiPromise, address: string, accountInfo: DeriveAccountInfo, filterName = '', onlyNamed = false): boolean {
  let isVisible = false;
  const filterLower = filterName.toLowerCase();

  if (filterLower || onlyNamed) {
    if (accountInfo) {
      const { accountId, accountIndex, identity, nickname } = accountInfo;

      if (!onlyNamed && (accountId?.toString().includes(filterName) || accountIndex?.toString().includes(filterName))) {
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
