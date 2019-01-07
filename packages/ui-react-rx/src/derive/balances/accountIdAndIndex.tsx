// Copyright 2017-2019 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { UnsubFunction } from '@polkadot/api/promise/types';
import { DeriveSubscription } from '../types';

import { decodeAddress } from '@polkadot/keyring';
import ApiPromise from '@polkadot/api/promise';
import { AccountId, AccountIndex } from '@polkadot/types';

import accountIdToIndex from './accountIdToIndex';
import accountIndexToId from './accountIndexToId';

export type IdAndIndex = [AccountId | undefined, AccountIndex | undefined];

export default function accountIdAndIndex (api: ApiPromise): DeriveSubscription {
  return (address: AccountId | AccountIndex | string | null | undefined, cb: (idAndIndex: IdAndIndex) => any): UnsubFunction => {
    try {
      // yes, this can fail, don't care too much, catch will catch it
      const length = decodeAddress((address as any).toString()).length;

      if (length === 32) {
        const accountId = new AccountId(address as string);

        return accountIdToIndex(api)(accountId, (accountIndex?: AccountIndex) =>
          cb([accountId, accountIndex])
        );
      }

      const accountIndex = new AccountIndex(address as string);

      return accountIndexToId(api)(accountIndex, (accountId?: AccountId) =>
        cb([accountId, accountIndex])
      );
    } catch (error) {
      // swallow
    }

    cb([undefined, undefined]);

    // just return empties
    return (): void => {
      // nothing to unsubscribe from
    };
  };
}
