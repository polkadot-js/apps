// Copyright 2017-2019 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { UnsubFunction } from '@polkadot/api/promise/types';
import { DeriveSubscription, DerivedBalances } from '../types';

import ApiPromise from '@polkadot/api/promise';
import { AccountId, AccountIndex, Balance } from '@polkadot/types';

import accountIdAndIndex from './accountIdAndIndex';

const EMPTY_ACCOUNT = new AccountId(new Uint8Array(32));

export default function votingBalance (api: ApiPromise): DeriveSubscription {
  return (address: AccountIndex | AccountId | string, cb: (balance: DerivedBalances) => any): UnsubFunction => {
    let combineDestroy: UnsubFunction | undefined;
    const idDestory = accountIdAndIndex(api)(address, ([accountId]: [AccountId | undefined]) => {
      const handler = (freeBalance?: Balance, reservedBalance?: Balance) => {
        cb({
          accountId: accountId || EMPTY_ACCOUNT,
          freeBalance: freeBalance || new Balance(0),
          nominatedBalance: new Balance(0),
          reservedBalance: reservedBalance || new Balance(0),
          stakingBalance: new Balance(0),
          votingBalance: new Balance(
            (freeBalance || new Balance(0)).add(reservedBalance || new Balance(0))
          )
        });
      };

      if (combineDestroy) {
        combineDestroy();
        combineDestroy = undefined;
      }

      if (!accountId) {
        return handler();
      }

      combineDestroy = api.combineLatest([
        [api.query.balances.freeBalance, accountId],
        [api.query.balances.reservedBalance, accountId]
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
