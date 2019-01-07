// Copyright 2017-2019 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueryableStorageFunction, UnsubFunction } from '@polkadot/api/promise/types';
import { DeriveSubscription } from '../types';

import BN from 'bn.js';
import ApiPromise from '@polkadot/api/promise';
import { AccountId, bool as Bool } from '@polkadot/types';

export default function votes (api: ApiPromise): DeriveSubscription {
  return (...params: Array<any>): UnsubFunction => {
    const referendumId: BN = params[0];
    const accountIds: Array<AccountId> = params.slice(1, params.length - 1);
    const cb: (infos: Array<Bool>) => any = params[params.length - 1];

    return api.combineLatest(
      accountIds.map((accountId) =>
        [api.query.democracy.voteOf, [referendumId, accountId]] as [QueryableStorageFunction, ...Array<any>]
      ), cb);
  };
}
