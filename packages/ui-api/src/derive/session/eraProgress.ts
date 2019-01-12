// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PromiseSubscription } from '@polkadot/api/promise/types';
import { DeriveSubscription } from '../types';

import BN from 'bn.js';
import ApiPromise from '@polkadot/api/promise';

import sessionProgress from './sessionProgress';

export default function eraProgress (api: ApiPromise): DeriveSubscription {
  return (cb: (count: BN) => any): PromiseSubscription =>
    api.combineLatest([
      sessionProgress(api),
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
}
