// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PromiseSubscription } from '@polkadot/api/promise/types';
import { DeriveSubscription } from '../types';

import ApiPromise from '@polkadot/api/promise';
import { AccountId, AccountIndex } from '@polkadot/types';
import { ENUMSET_SIZE } from '@polkadot/types/AccountIndex';

export default function accountIndexToId (api: ApiPromise): DeriveSubscription {
  return async (_accountIndex: AccountIndex | string, cb: (accountId?: AccountId) => any): PromiseSubscription => {
    const accountIndex = _accountIndex instanceof AccountIndex
      ? _accountIndex
      : new AccountIndex(_accountIndex);

    return api.query.balances.enumSet(accountIndex, (accounts: Array<AccountId>) =>
      cb((accounts || [])[accountIndex.mod(ENUMSET_SIZE).toNumber()])
    );
  };
}
