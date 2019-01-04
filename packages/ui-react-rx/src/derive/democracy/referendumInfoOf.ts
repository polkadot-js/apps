// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { UnsubFunction } from '@polkadot/api/promise/types';
import { DeriveSubscription } from '../types';

import BN from 'bn.js';
import ApiPromise from '@polkadot/api/promise';
import { ReferendumInfo } from '@polkadot/types';
import { Tuple } from '@polkadot/types/codec';

export default function referendumInfoOf (api: ApiPromise): DeriveSubscription {
  return (referendumId: BN | number, cb: (referendum?: ReferendumInfo) => any): UnsubFunction =>
    api.query.democracy.referendumInfoOf(referendumId, (result?: Tuple) =>
      cb(
        result
          ? result[0] as ReferendumInfo
          : undefined
      )
    );
}
