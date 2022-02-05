// Copyright 2017-2022 @polkadot/app-uniques authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageKey } from '@polkadot/types';
import type { UniqueId } from '@polkadot/types/interfaces';

import { createNamedHook, useApi, useEventTrigger, useMapKeys } from '@polkadot/react-hooks';

function extractUniqueId (keys: StorageKey<[UniqueId]>[]): UniqueId[] {
  return keys
    .map(({ args: [uniqueId] }) => uniqueId)
    .sort((a, b) => a.cmp(b));
}

function useUniqueIdsImpl (): UniqueId[] | undefined {
  const { api } = useApi();
  const trigger = useEventTrigger([api.events.uniques.Created, api.events.uniques.Destroyed]);

  return useMapKeys(api.query.uniques.class, { at: trigger.blockHash, transform: extractUniqueId });
}

export default createNamedHook('useUniqueIds', useUniqueIdsImpl);
