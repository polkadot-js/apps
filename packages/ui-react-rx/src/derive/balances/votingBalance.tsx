// Copyright 2017-2019 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { UnsubFunction } from '@polkadot/api/promise/types';
import { DeriveSubscription, DerivedBalances } from '../types';

import ApiPromise from '@polkadot/api/promise';
import { AccountId, AccountIndex, Balance } from '@polkadot/types';

import accountIdAndIndex from './accountIdAndIndex';

export default function votingBalance (api: ApiPromise): DeriveSubscription {
  return (address: AccountIndex | AccountId | string, cb: (balance: DerivedBalances) => any): UnsubFunction => {
    let combineDestroy: UnsubFunction | undefined;
    const idDestory = accountIdAndIndex(api)(address, ([accountId]: [AccountId | undefined]) => {
      const handler = (freeBalance?: Balance, reservedBalance?: Balance) =>
        cb({
          accountId,
          freeBalance: freeBalance || new Balance(0),
          nominatedBalance: new Balance(0),
          reservedBalance: reservedBalance || new Balance(0),
          stakingBalance: new Balance(0),
          votingBalance: new Balance(
            (freeBalance || new Balance(0)).add(reservedBalance || new Balance(0))
          )
        });

      if (combineDestroy) {
        combineDestroy();
        combineDestroy = undefined;
      }

      if (!accountId) {
        return handler();
      }

      combineDestroy = api.combineLatest([
        [[accountId], api.query.balances.freeBalance],
        [[accountId], api.query.balances.reservedBalance]
      ], ([freeBalance, reservedBalance]) =>
        handler(freeBalance, reservedBalance)
      );
    });

    return (): void => {
      idDestory();

      if (combineDestroy) {
        combineDestroy();
      }
    };
  };
}
