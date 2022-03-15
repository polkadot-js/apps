// Copyright 2017-2022 @polkadot/app-nfts authors & contributors
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

function useCollectionIdsImpl (): AssetId[] | undefined {
  const { api } = useApi();
  const trigger = useEventTrigger([
    api.events.uniques.Created,
    api.events.uniques.Destroyed
  ]);

  return useMapKeys(api.query.uniques.class, options, trigger.blockHash);
}

export default createNamedHook('useCollectionIds', useCollectionIdsImpl);
