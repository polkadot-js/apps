// Copyright 2017-2019 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { UnsubFunction } from '@polkadot/api/promise/types';
import { DeriveSubscription } from '../types';

import BN from 'bn.js';
import ApiPromise from '@polkadot/api/promise';

export default function eraLength (api: ApiPromise): DeriveSubscription {
  return (cb: (count: BN) => any): UnsubFunction =>
    api.combineLatest([
      api.query.session.sessionLength,
      api.query.staking.sessionsPerEra
    ], ([sessionLength, sessionsPerEra]) =>
      cb((sessionLength || new BN(1)).mul(sessionsPerEra || new BN(1)))
    );
}
