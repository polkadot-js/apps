// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { RxApiInterface } from '@polkadot/api-rx/types';
import { ExtendedBalance, ExtendedBalanceMap, ObservableApiInterface } from './types';

import BN from 'bn.js';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, toArray } from 'rxjs/operators';
import storage from '@polkadot/storage';
import encodeAddress from '@polkadot/util-keyring/address/encode';

export default class ObservableApi implements ObservableApiInterface {
  private api: RxApiInterface;

  constructor (api: RxApiInterface) {
    this.api = api;
  }

  validatingBalance = (address: string): Observable<ExtendedBalance> => {
    return combineLatest(
      this.votingBalance(address),
      this.api.state
        .getStorage(storage.staking.public.nominatorsFor, address)
        .pipe(
          switchMap((nominators = []) =>
            // FIXME: Will not be needed after https://github.com/polkadot-js/apps/issues/128
            this.votingBalances(nominators.map(encodeAddress))
          ),
          toArray()
        )
    ).pipe(
      map(([balance, [nominators = []]]: [ExtendedBalance, [Array<ExtendedBalance>]]): ExtendedBalance => {
        const nominatedBalance = nominators.reduce((total, nominator: ExtendedBalance) => {
          return total.add(nominator.votingBalance);
        }, new BN(0));

        return {
          ...balance,
          nominators,
          nominatedBalance,
          stakingBalance: nominatedBalance.add(balance.votingBalance)
        };
      })
    );
  }

  validatingBalances = (addresses: Array<string>): Observable<ExtendedBalanceMap> => {
    return combineLatest(
      addresses.map((address) =>
        this.validatingBalance(address)
      )
    ).pipe(
      map((result: Array<ExtendedBalance>): ExtendedBalanceMap => {
        return result.reduce((balances, balance) => {
          balances[balance.address] = balance;

          return balances;
        }, {} as ExtendedBalanceMap);
      })
    );
  }

  votingBalance = (address: string): Observable<ExtendedBalance> => {
    return combineLatest(
      this.api.state.getStorage(storage.staking.public.freeBalanceOf, address),
      this.api.state.getStorage(storage.staking.public.reservedBalanceOf, address)
    ).pipe(
      map(([freeBalance = new BN(0), reservedBalance = new BN(0)]): ExtendedBalance => ({
        address,
        freeBalance,
        nominatedBalance: new BN(0),
        reservedBalance,
        stakingBalance: new BN(0),
        votingBalance: freeBalance.add(reservedBalance)
      }))
    );
  }

  votingBalances = (addresses: Array<string>): Observable<ExtendedBalance[]> => {
    return combineLatest(
      addresses.map((address) =>
        this.votingBalance(address)
      )
    );
  }
}
