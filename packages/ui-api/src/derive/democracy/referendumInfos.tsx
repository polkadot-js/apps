// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CombinatorFunction } from '@polkadot/api/promise/Combinator';
import { PromiseSubscription } from '@polkadot/api/promise/types';
import { DeriveSubscription } from '../types';

import BN from 'bn.js';
import ApiPromise from '@polkadot/api/promise';
import { ReferendumInfo } from '@polkadot/types';

export default function referendumInfos (api: ApiPromise): DeriveSubscription {
  return async (...params: Array<any>): PromiseSubscription => {
    const ids: Array<BN | number> = params.slice(0, params.length - 1);
    const cb: (infos: Array<ReferendumInfo>) => any = params[params.length - 1];

    return api.combineLatest(
      ids.map((id) =>
        [api.query.democracy.referendumInfoOf, id] as [CombinatorFunction, ...Array<any>]
      ), (infos: Array<ReferendumInfo | undefined>) =>
        cb(
          (infos || []).filter((info) => info) as Array<ReferendumInfo>
        )
    );
  };
}
