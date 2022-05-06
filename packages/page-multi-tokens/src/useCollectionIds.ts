// Copyright 2017-2022 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Changes } from '@polkadot/react-hooks/useEventChanges';
import type { StorageKey, u128 } from '@polkadot/types';
import type { EventRecord } from '@polkadot/types/interfaces';

import { createNamedHook, useApi, useEventChanges, useMapKeys } from '@polkadot/react-hooks';

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

const useCollectionIdsImpl = (): u128[] => {
  const { api } = useApi();
  const startValue = useMapKeys(api.query.multiTokens.collections, keyOptions);

  return useEventChanges([api.events.multiTokens.CollectionCreated, api.events.multiTokens.CollectionDestroyed], filter, startValue);
};

export default createNamedHook('useCollectionIds', useCollectionIdsImpl);
