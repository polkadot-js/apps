// Copyright 2017-2019 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { UnsubFunction } from '@polkadot/api/promise/types';
import { DeriveSubscription, DerivedBalances } from '../types';

import ApiPromise from '@polkadot/api/promise';
import { AccountId } from '@polkadot/types';

import votingBalances from './votingBalances';

export default function votingBalancesNominatorsFor (api: ApiPromise): DeriveSubscription {
  return (accountId: AccountId | string, cb: (balance: Array<DerivedBalances>) => any): UnsubFunction => {
    let combineDestroy: UnsubFunction | undefined;
    const nominatorDestory = api.query.staking.nominatorsFor(accountId, (nominators?: Array<AccountId>) => {
      if (combineDestroy) {
        combineDestroy();
      }

      combineDestroy = votingBalances(api)(...(nominators || []), cb);
    });

    return (): void => {
      nominatorDestory();

      if (combineDestroy) {
        combineDestroy();
      }
    };
  };
}
