// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSubscription } from '../types';

import BN from 'bn.js';
import ApiPromise from '@polkadot/api/promise';
import { AccountId, AccountIndex } from '@polkadot/types';
import { ENUMSET_SIZE } from '@polkadot/types/AccountIndex';

export default function accountIndexes (api: ApiPromise): DeriveSubscription {
  return {
    subscribe: async (cb: (indexes: Array<AccountIndex>) => any): Promise<number> => {
      return api.query.balances.nextEnumSet((nextIndex: AccountIndex) => {
        const lastIndex = nextIndex || new BN(0);
        const setSize = ENUMSET_SIZE.toNumber();
        const enumRange = [...Array(lastIndex.div(ENUMSET_SIZE).toNumber() + 1).keys()].map((index) =>
          [[index], api.query.balances.enumSet]
        );

        return api.combineLatest(enumRange, (all: Array<Array<AccountId> | undefined> = []) => {
          cb(
            all.reduce((result, list = [], outerIndex: number) => {
              list.forEach((accountId, innerIndex) => {
                const index = (outerIndex * setSize) + innerIndex;

                result[accountId.toString()] = new AccountIndex(index);
              });

              return result;
            }, {} as { [index: string]: AccountIndex })
          );
        });
      }) as any as Promise<number>;
    },
    unsubscribe: (subscriptionId: number): Promise<any> =>
      api.query.balances.nextEnumSet.unsubscribe(subscriptionId)
  };
}
