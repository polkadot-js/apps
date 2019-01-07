// Copyright 2017-2019 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CombinatorFunction } from '@polkadot/api/promise/Combinator';
import { UnsubFunction } from '@polkadot/api/promise/types';
import { DeriveSubscription, DerivedBalancesMap } from '../types';

import ApiPromise from '@polkadot/api/promise';
import { AccountId } from '@polkadot/types';

import validatingBalance from './validatingBalance';

export default function votingBalances (api: ApiPromise): DeriveSubscription {
  return (...params: Array<any>): UnsubFunction => {
    const accountIds: Array<AccountId | string> = params.slice(0, params.length - 1);
    const cb: (balanceMap: DerivedBalancesMap) => any = params[params.length - 1];

    return api.combineLatest(
      accountIds.map((accountId) =>
        [validatingBalance(api), accountId] as [CombinatorFunction, ...Array<any>]
      ), (result) =>
        cb(
          result.reduce((balances, balance) => {
            balances[balance.address.toString()] = balance;

            return balances;
          }, {} as DerivedBalancesMap)
        )
    );
  };
}
