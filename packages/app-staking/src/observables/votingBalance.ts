// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { RxApiInterface } from '@polkadot/api-rx/types';
import { Balance } from './types';

import BN from 'bn.js';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import storage from '@polkadot/storage';

export default function votingBalance (api: RxApiInterface, address: string): Observable<Balance> {
  return combineLatest(
    api.state.getStorage(storage.staking.public.freeBalanceOf, address),
    api.state.getStorage(storage.staking.public.reservedBalanceOf, address)
  ).pipe(
    map(([freeBalance = new BN(0), reservedBalance = new BN(0)]): Balance => ({
      address,
      freeBalance,
      nominatedBalance: new BN(0),
      reservedBalance,
      stakingBalance: new BN(0),
      votingBalance: freeBalance.add(reservedBalance)
    }))
  );
}
