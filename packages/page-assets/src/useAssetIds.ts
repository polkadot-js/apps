// Copyright 2017-2022 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageKey } from '@polkadot/types';
import type { AssetId } from '@polkadot/types/interfaces';

import { createNamedHook, useApi, useEventTrigger, useMapKeys } from '@polkadot/react-hooks';

const options = {
  transform: (keys: StorageKey<[AssetId]>[]): AssetId[] =>
    keys
      .map(({ args: [assetId] }) => assetId)
      .sort((a, b) => a.cmp(b))
};

function useAssetIdsImpl (): AssetId[] | undefined {
  const { api } = useApi();
  const trigger = useEventTrigger([api.events.assets.Created, api.events.assets.Destroyed]);

  return useMapKeys(api.query.assets.asset, options, trigger.blockHash);
}

export default createNamedHook('useAssetIds', useAssetIdsImpl);
