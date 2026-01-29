// Copyright 2017-2025 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Changes } from '@polkadot/react-hooks/useEventChanges';
import type { StorageKey, u32 } from '@polkadot/types';
import type { EventRecord } from '@polkadot/types/interfaces';

import { createNamedHook, useApi, useEventChanges, useMapKeys } from '@polkadot/react-hooks';

const OPT_KEYS = {
  transform: (keys: StorageKey<[u32]>[]): u32[] =>
    keys
      .map(({ args: [id] }) => id)
      .sort((a, b) => a.cmp(b))
};

function filter (records: EventRecord[]): Changes<u32> {
  const added: u32[] = [];
  const removed: u32[] = [];

  records.forEach(({ event: { data: [id], method } }): void => {
    if (method === 'Created' || method === 'ForceCreated') {
      added.push(id as u32);
    } else {
      removed.push(id as u32);
    }
  });

  return { added, removed };
}

function useCollectionIdsImpl (): u32[] | undefined {
  const { api } = useApi();
  const startValue = useMapKeys(api.query.uniques.class, [], OPT_KEYS);

  return useEventChanges([
    api.events.uniques.Created,
    api.events.uniques.Destroyed,
    api.events.uniques.ForceCreated
  ], filter, startValue);
}

export default createNamedHook('useCollectionIds', useCollectionIdsImpl);
