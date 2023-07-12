// Copyright 2017-2023 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Changes } from '@polkadot/react-hooks/useEventChanges';
import type { StorageKey, u32 } from '@polkadot/types';
import type { EventRecord } from '@polkadot/types/interfaces';

import { createNamedHook, useApi, useEventChanges, useMapKeys } from '@polkadot/react-hooks';

const EMPTY_PARAMS: unknown[] = [];

const OPT_KEY = {
  transform: (keys: StorageKey<[u32]>[]): u32[] =>
    keys.map(({ args: [id] }) => id)
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

function useAssetIdsImpl () {
  const { api } = useApi();
  const startValue = useMapKeys(api.query.assets.asset, EMPTY_PARAMS, OPT_KEY);

  return useEventChanges([
    api.events.assets.Created,
    api.events.assets.Destroyed,
    api.events.assets.ForceCreated
  ], filter, startValue);
}

export default createNamedHook('useAssetIds', useAssetIdsImpl);
