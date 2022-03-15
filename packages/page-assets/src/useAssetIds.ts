// Copyright 2017-2022 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Changes } from '@polkadot/react-hooks/useEventChanges';
import type { StorageKey } from '@polkadot/types';
import type { AssetId, EventRecord } from '@polkadot/types/interfaces';

import { createNamedHook, useApi, useEventChanges, useMapKeys } from '@polkadot/react-hooks';

const keyOptions = {
  transform: (keys: StorageKey<[AssetId]>[]): AssetId[] =>
    keys.map(({ args: [id] }) => id)
};

function filter (records: EventRecord[]): Changes<AssetId> {
  const added: AssetId[] = [];
  const removed: AssetId[] = [];

  records.forEach(({ event: { data: [id], method } }): void => {
    if (method === 'Created') {
      added.push(id as AssetId);
    } else {
      removed.push(id as AssetId);
    }
  });

  return { added, removed };
}

function useAssetIdsImpl (): AssetId[] | undefined {
  const { api } = useApi();
  const startValue = useMapKeys(api.query.assets.asset, keyOptions);

  return useEventChanges([
    api.events.assets.Created,
    api.events.assets.Destroyed
  ], filter, startValue);
}

export default createNamedHook('useAssetIds', useAssetIdsImpl);
