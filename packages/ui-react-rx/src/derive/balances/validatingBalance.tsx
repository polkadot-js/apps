// Copyright 2017-2019 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CombinatorFunction } from '@polkadot/api/promise/Combinator';
import { UnsubFunction } from '@polkadot/api/promise/types';
import { DeriveSubscription, DerivedBalances } from '../types';

import BN from 'bn.js';
import ApiPromise from '@polkadot/api/promise';
import { AccountId, Balance } from '@polkadot/types';

import votingBalance from './votingBalance';
import votingBalancesNominatorsFor from './votingBalancesNominatorsFor';

export default function validatingBalance (api: ApiPromise): DeriveSubscription {
  return (accountId: AccountId | string, cb: (balance: DerivedBalances) => any): UnsubFunction =>
    api.combineLatest([
      [votingBalance(api), accountId] as [CombinatorFunction, ...Array<any>],
      [votingBalancesNominatorsFor(api), accountId] as [CombinatorFunction, ...Array<any>]
    ], ([balance, nominators]) => {
      const nominatedBalance = nominators.reduce((total: BN, nominatorBalance: DerivedBalances) => {
        return total.add(nominatorBalance.votingBalance);
      }, new BN(0));

      cb({
        ...balance,
        nominators,
        nominatedBalance: new Balance(nominatedBalance),
        stakingBalance: new Balance(
          nominatedBalance.add(balance.votingBalance)
        )
      });
    });
}
