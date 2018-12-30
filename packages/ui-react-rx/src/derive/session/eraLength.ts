// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSubscription } from '../types';

import BN from 'bn.js';
import ApiPromise from '@polkadot/api/promise';
import Combinator from '@polkadot/api/promise/Combinator';

export default function eraLength (api: ApiPromise): DeriveSubscription {
  return {
    subscribe: async (cb: (count: BN) => any): Promise<number> => {
      const combinator = api.combineLatest([
        api.query.session.sessionLength,
        api.query.staking.sessionsPerEra
      ], ([sessionLength, sessionsPerEra]: [BN | undefined, BN | undefined]) =>
        cb((sessionLength || new BN(1)).mul(sessionsPerEra || new BN(1)))
      );

      return combinator.id;
    },
    unsubscribe: (subscriptionId: number): Promise<any> =>
      Combinator.unsubscribe(subscriptionId)
  };
}
