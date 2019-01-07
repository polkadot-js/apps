// Copyright 2017-2019 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { UnsubFunction } from '@polkadot/api/promise/types';
import { DeriveSubscription } from '../types';

import ApiPromise from '@polkadot/api/promise';
import { AccountId, AccountIndex } from '@polkadot/types';

import accountIndexes, { AccountIndexes } from './accountIndexes';

export default function accountIdToIndex (api: ApiPromise): DeriveSubscription {
  return (accountId: AccountId | string, cb: (index?: AccountIndex) => any): UnsubFunction =>
    accountIndexes(api)((indexes?: AccountIndexes) =>
      cb((indexes || {})[accountId.toString()])
    );
}
