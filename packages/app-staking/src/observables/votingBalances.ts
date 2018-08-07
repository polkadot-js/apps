// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { RxApiInterface } from '@polkadot/api-rx/types';
import { Balance } from './types';

import { Observable, combineLatest } from 'rxjs';

import votingBalance from './votingBalance';

export default function votingBalances (api: RxApiInterface, addresses: Array<string>): Observable<Balance[]> {
  return combineLatest(
    addresses.map((address) =>
      votingBalance(api, address)
    )
  );
}
