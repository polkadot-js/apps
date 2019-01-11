// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PromiseSubscription } from '@polkadot/api/promise/types';
import { DeriveSubscription } from '../types';

import ApiPromise from '@polkadot/api/promise';
import { BlockNumber, Header } from '@polkadot/types';

export default function bestNumberFinalised (api: ApiPromise): DeriveSubscription {
  return (cb: (blockNumber: BlockNumber) => any): PromiseSubscription =>
    api.rpc.chain.subscribeFinalisedHeads((header?: Header) => {
      if (header && header.blockNumber) {
        cb(header.blockNumber);
      }
    }) as PromiseSubscription;
}
