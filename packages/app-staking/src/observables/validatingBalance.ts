// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { RxApiInterface } from '@polkadot/api-rx/types';
import { Balance } from './types';

import BN from 'bn.js';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, toArray } from 'rxjs/operators';
import storage from '@polkadot/storage';
import encodeAddress from '@polkadot/util-keyring/address/encode';

import votingBalance from './votingBalance';
import votingBalances from './/votingBalances';

type Result = [Balance, [Array<Balance>]];

export default function validatingBalance (api: RxApiInterface, address: string): Observable<Balance> {
  return combineLatest(
    votingBalance(api, address),
    api.state
      .getStorage(storage.staking.public.nominatorsFor, address)
      .pipe(
        switchMap((nominators = []) =>
          // FIXME: Will not be needed after https://github.com/polkadot-js/apps/issues/128
          votingBalances(api, nominators.map(encodeAddress))
        ),
        toArray()
      )
  ).pipe(
    map(([balance, [nominators = []]]: Result): Balance => {
      const nominatedBalance = nominators.reduce((total, nominator: Balance) => {
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
