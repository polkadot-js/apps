// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSubscription } from '../types';
import { BlockNumber, Header } from '@polkadot/types';

import ApiPromise from '@polkadot/api/promise';

export default function bestNumberFinalised (api: ApiPromise): DeriveSubscription {
  return {
    subscribe: (cb: (blockNumber: BlockNumber) => any): Promise<number> =>
      api.rpc.chain.subscribeFinalisedHeads((header?: Header) => {
        if (header && header.blockNumber) {
          cb(header.blockNumber);
        }
      }),
    unsubscribe: (subscriptionId: number): Promise<any> =>
      api.rpc.chain.subscribeFinalisedHeads.unsubscribe(subscriptionId)
  };
}
