// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PromiseSubscription } from '@polkadot/api/promise/types';
import { DeriveSubscription } from '../types';

import BN from 'bn.js';
import ApiPromise from '@polkadot/api/promise';

import bestNumber from '../chain/bestNumber';

export default function sessionProgress (api: ApiPromise): DeriveSubscription {
  return (cb: (count: BN) => any): PromiseSubscription =>
    api.combineLatest([
      bestNumber(api),
      api.query.session.sessionLength,
      api.query.session.lastLengthChange
    ], ([bestNumber, sessionLength, lastLengthChange]) =>
      cb(
        (bestNumber || new BN(0))
          .sub(lastLengthChange || new BN(0))
          .add(sessionLength || new BN(1))
          .mod(sessionLength || new BN(1))
      )
    );
}
