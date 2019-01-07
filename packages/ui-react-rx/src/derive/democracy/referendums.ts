// Copyright 2017-2019 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { UnsubFunction } from '@polkadot/api/promise/types';
import { DeriveSubscription } from '../types';

import ApiPromise from '@polkadot/api/promise';
import { ReferendumInfo } from '@polkadot/types';

import referendumInfos from './referendumInfos';

export default function referendums (api: ApiPromise): DeriveSubscription {
  return (cb: (referendums: Array<ReferendumInfo>) => any): UnsubFunction => {
    let innerDispose: UnsubFunction | undefined;
    const outerDispose = api.combineLatest([
      api.query.democracy.nextTally,
      api.query.democracy.referendumCount
    ], ([nextTally, referendumCount]) => {
      if (innerDispose) {
        innerDispose();
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

    return (): void => {
      outerDispose();

      if (innerDispose) {
        innerDispose();
      }
    };
  };
}
