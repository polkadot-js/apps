// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSubscription } from '../types';

import BN from 'bn.js';
import ApiPromise from '@polkadot/api/promise';
import Combinator from '@polkadot/api/promise/Combinator';

import bestNumber from '../chain/bestNumber';

export default function sessionProgress (api: ApiPromise): DeriveSubscription {
  return {
    subscribe: async (cb: (count: BN) => any): Promise<number> => {
      const combinator = api.combineLatest([
        bestNumber(api).subscribe,
        api.query.session.sessionLength,
        api.query.session.lastLengthChange
      ], ([bestNumber, sessionLength, lastLengthChange]) =>
        cb(
          (bestNumber || new BN(0))
            .sub(lastLengthChange || new BN(0))
            .add(sessionLength || new BN(0))
            .mod(sessionLength || new BN(0))
        )
      );

      return combinator.id;
    },
    unsubscribe: (subscriptionId: number): Promise<any> =>
      Combinator.unsubscribe(subscriptionId)
  };
}
