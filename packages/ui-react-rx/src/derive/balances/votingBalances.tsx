// Copyright 2017-2019 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CombinatorFunction } from '@polkadot/api/promise/Combinator';
import { UnsubFunction } from '@polkadot/api/promise/types';
import { DeriveSubscription, DerivedBalances } from '../types';

import ApiPromise from '@polkadot/api/promise';
import { AccountId, AccountIndex } from '@polkadot/types';

import votingBalance from './votingBalance';

export default function votingBalances (api: ApiPromise): DeriveSubscription {
  return (...params: Array<any>): UnsubFunction => {
    const addresses: Array<AccountIndex | AccountId | string> = params.slice(0, params.length - 1);
    const cb: (balance: Array<DerivedBalances>) => any = params[params.length - 1];

    return api.combineLatest(
      addresses.map((address) =>
        [votingBalance(api), address] as [CombinatorFunction, ...Array<any>]
      ), cb
    );
  };
}
