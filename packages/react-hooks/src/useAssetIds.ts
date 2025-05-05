// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageKey, u32 } from '@polkadot/types';
import type { EventRecord } from '@polkadot/types/interfaces';
import type { Changes } from './useEventChanges.js';

import { createNamedHook, useApi, useEventChanges, useMapKeys } from './index.js';

const EMPTY_PARAMS: unknown[] = [];

const OPT_KEY = {
  transform: (keys: StorageKey<[u32]>[]): u32[] =>
    keys.map(({ args: [id] }) => id).filter((id) => id !== undefined)
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

function useAssetIdsImpl (): u32[] | undefined {
  const { api } = useApi();
  const startValue = useMapKeys(api.query.assets?.asset, EMPTY_PARAMS, OPT_KEY) || [];

  return useEventChanges([
    api.events.assets?.Created,
    api.events.assets?.Destroyed,
    api.events.assets?.ForceCreated
  ], filter, startValue);
}

export const useAssetIds = createNamedHook('useAssetIds', useAssetIdsImpl);
