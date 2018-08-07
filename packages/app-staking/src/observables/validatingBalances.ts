// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { RxApiInterface } from '@polkadot/api-rx/types';
import { Balance, BalanceMap } from './types';

import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import validatingBalance from './validatingBalance';

export default function validatingBalances (api: RxApiInterface, addresses: Array<string>): Observable<BalanceMap> {
  return combineLatest(
    addresses.map((address) =>
      validatingBalance(api, address)
    )
  ).pipe(
    map((result: Array<Balance>): BalanceMap => {
      return result.reduce((balances, balance) => {
        balances[balance.address] = balance;

        return balances;
      }, {} as BalanceMap);
    })
  );
}
