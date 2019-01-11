// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PromiseSubscription } from '@polkadot/api/promise/types';
import { DeriveSubscription } from '../types';

import ApiPromise from '@polkadot/api/promise';
import { ReferendumInfo } from '@polkadot/types';

import referendumInfos from './referendumInfos';

export default function referendums (api: ApiPromise): DeriveSubscription {
  return async (cb: (referendums: Array<ReferendumInfo>) => any): PromiseSubscription => {
    let innerDispose: PromiseSubscription | undefined;
    const outerDispose = api.combineLatest([
      api.query.democracy.nextTally,
      api.query.democracy.referendumCount
    ], async ([nextTally, referendumCount]) => {
      if (innerDispose) {
        const unsubscribe = await innerDispose;

        unsubscribe();
        innerDispose = undefined;
      }

      if (referendumCount && nextTally && referendumCount.gt(nextTally) && referendumCount.gtn(0)) {
        innerDispose = referendumInfos(api)(
          ...[...Array(referendumCount.sub(nextTally).toNumber())].map((_, i) =>
            nextTally.addn(i)
          ), cb
        );
      } else {
        cb([]);
      }
    });

    return async () => {
      let unsubscribe = await outerDispose;

      unsubscribe();

      if (innerDispose) {
        unsubscribe = await innerDispose;

        unsubscribe();
      }
    };
  };
}
