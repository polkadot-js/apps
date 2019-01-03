// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSubscription } from '../types';

import ApiPromise from '@polkadot/api/promise';
import { AccountId, AccountIndex } from '@polkadot/types';

import accountIndexes, { AccountIndexes } from './accountIndexes';

export default function accountIdToIndex (api: ApiPromise): DeriveSubscription {
  return {
    subscribe: async (accountId: AccountId | string, cb: (index?: AccountIndex) => any): Promise<number> => {
      return accountIndexes(api).subscribe((indexes?: AccountIndexes): any =>
        cb((indexes || {})[accountId.toString()])
      );
    },
    unsubscribe: (subscriptionId: number): Promise<any> =>
      accountIndexes(api).unsubscribe(subscriptionId)
  };
}
