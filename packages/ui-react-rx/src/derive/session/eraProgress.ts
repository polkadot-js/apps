// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSubscription } from '../types';

import BN from 'bn.js';
import ApiPromise from '@polkadot/api/promise';
import Combinator from '@polkadot/api/promise/Combinator';

import sessionProgress from './sessionProgress';

export default function eraProgress (api: ApiPromise): DeriveSubscription {
  return {
    subscribe: async (cb: (count: BN) => any): Promise<number> => {
      const combinator = api.combineLatest([
        sessionProgress(api).subscribe,
        api.query.session.currentIndex,
        api.query.session.sessionLength,
        api.query.staking.lastEraLengthChange,
        api.query.staking.sessionsPerEra
      ], ([sessionProgress, currentIndex, sessionLength, lastEraLengthChange, sessionsPerEra]) =>
        cb(
          (currentIndex || new BN(0))
            .sub(lastEraLengthChange || new BN(0))
            .mod(sessionsPerEra || new BN(1))
            .mul(sessionLength || new BN(1))
            .add(sessionProgress || new BN(0))
        )
      );

      return combinator.id;
    },
    unsubscribe: (subscriptionId: number): Promise<any> =>
      Combinator.unsubscribe(subscriptionId)
  };
}
