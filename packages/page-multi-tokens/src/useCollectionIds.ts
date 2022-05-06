// Copyright 2017-2022 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Changes } from '@polkadot/react-hooks/useEventChanges';
import type { StorageKey, u128, Option } from '@polkadot/types';
import type { EventRecord } from '@polkadot/types/interfaces';

import { createNamedHook, useAccounts, useApi, useEventChanges, useMapEntries, useMapKeys } from '@polkadot/react-hooks';
import { Collection } from './types';

type CollectionList = { id: u128; data: Collection | null }[];

const entryOptions = {
  transform: (keys: [StorageKey<[u128]>, Option<Collection>][]): CollectionList => {
    return keys.map(([storageKey, optCollection]) => {
      const data = optCollection.unwrapOr(null);
      return {
        id: storageKey.args[0] as u128,
        data
      };
    });
  }
};

const keyOptions = {
  transform: (keys: StorageKey<[u128]>[]): u128[] => keys.map(({ args: [id] }) => id).sort((a, b) => a.cmp(b))
};

const filter = (records: EventRecord[]): Changes<u128> => {
  const added: u128[] = [];
  const removed: u128[] = [];

  records.forEach(
    ({
      event: {
        data: [id],
        method
      }
    }): void => {
      if (method === 'CollectionCreated') {
        added.push(id as u128);
      } else {
        removed.push(id as u128);
      }
    }
  );

  return { added, removed };
};

const useCollectionIdsImpl = (accountOnly?: boolean): u128[] => {
  const { api } = useApi();
  const { hasAccounts, allAccounts } = useAccounts();

  let startValue = accountOnly && hasAccounts ? useMapEntries(api.query.multiTokens.collections, entryOptions) : useMapKeys(api.query.multiTokens.collections, keyOptions);

  if (accountOnly && hasAccounts && startValue) {
    startValue = (startValue as CollectionList).filter((a) => a.data && allAccounts.includes(a.data.owner.toHuman())).map(({ id }) => id);
  }

  return accountOnly ? (startValue as u128[]) || [] : useEventChanges([api.events.multiTokens.CollectionCreated, api.events.multiTokens.CollectionDestroyed], filter, startValue as u128[]);
};

export default createNamedHook('useCollectionIds', useCollectionIdsImpl);
