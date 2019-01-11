// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueryableStorageFunction, PromiseSubscription } from '@polkadot/api/promise/types';
import { DeriveSubscription } from '../types';

import BN from 'bn.js';
import ApiPromise from '@polkadot/api/promise';
import { AccountId, AccountIndex } from '@polkadot/types';
import { ENUMSET_SIZE } from '@polkadot/types/AccountIndex';

export type AccountIndexes = { [index: string]: AccountIndex };

export default function accountIndexes (api: ApiPromise): DeriveSubscription {
  return async (cb: (indexes: AccountIndexes) => any): PromiseSubscription => {
    let combineDestroy: PromiseSubscription | undefined;
    const nextEnumSetDestory = api.query.balances.nextEnumSet(async (next: AccountIndex) => {
      const setSize = ENUMSET_SIZE.toNumber();
      const enumRange = [...Array((next || new BN(0)).div(ENUMSET_SIZE).toNumber() + 1).keys()].map((index) =>
        [api.query.balances.enumSet, index] as [QueryableStorageFunction, ...Array<any>]
      );

      if (combineDestroy) {
        const unsubscribe = await combineDestroy;

        unsubscribe();
      }

      combineDestroy = api.combineLatest(enumRange, (all: Array<Array<AccountId> | undefined>) => {
        cb(
          (all || []).reduce((result, list, outerIndex) => {
            (list || []).forEach((accountId, innerIndex) => {
              const index = (outerIndex * setSize) + innerIndex;

              result[accountId.toString()] = new AccountIndex(index);
            });

            return result;
          }, {} as AccountIndexes)
        );
      });
    }) as any as PromiseSubscription; // wtf???

    return async (): Promise<void> => {
      let unsubscribe = await nextEnumSetDestory;

      unsubscribe();

      if (combineDestroy) {
        unsubscribe = await combineDestroy;

        unsubscribe();
      }
    };
  };
}
