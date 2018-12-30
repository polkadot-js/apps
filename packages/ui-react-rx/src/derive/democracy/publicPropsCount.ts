// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSubscription } from '../types';

import BN from 'bn.js';
import ApiPromise from '@polkadot/api/promise';

export default function publicPropsCount (api: ApiPromise): DeriveSubscription {
  return {
    subscribe: (cb: (count: BN) => any): Promise<number> =>
      api.query.democracy.publicProps((props?: Array<any> | null) =>
        cb(new BN((props || []).length))
      ),
    unsubscribe: (subscriptionId: number): Promise<any> =>
      api.query.democracy.publicProps.unsubscribe(subscriptionId)
  };
}
