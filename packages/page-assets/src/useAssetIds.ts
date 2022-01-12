// Copyright 2017-2022 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageKey } from '@polkadot/types';
import type { AssetId } from '@polkadot/types/interfaces';

import { createNamedHook, useApi, useEventTrigger, useMapKeys } from '@polkadot/react-hooks';

function extractAssetIds (keys: StorageKey<[AssetId]>[]): AssetId[] {
  return keys
    .map(({ args: [assetId] }) => assetId)
    .sort((a, b) => a.cmp(b));
}

function useAssetIdsImpl (): AssetId[] | undefined {
  const { api } = useApi();
  const trigger = useEventTrigger([api.events.assets.Created, api.events.assets.Destroyed]);

  return useMapKeys(api.query.assets.asset, { at: trigger.blockHash, transform: extractAssetIds });
}

export default createNamedHook('useAssetIds', useAssetIdsImpl);
