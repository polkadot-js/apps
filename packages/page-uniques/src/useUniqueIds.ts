// Copyright 2017-2022 @polkadot/app-uniques authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageKey } from '@polkadot/types';
// import type { UniqueId } from '@polkadot/types/interfaces';
import type { u32 } from '@polkadot/types-codec';

import { createNamedHook, useApi, useEventTrigger, useMapKeys } from '@polkadot/react-hooks';

type ClassId = u32;

function extractUniqueId (keys: StorageKey<[ClassId]>[]): ClassId[] {
  return keys
    .map(({ args: [classId] }) => classId)
    .sort((a, b) => a.cmp(b));
}

function useUniqueIdsImpl (): ClassId[] | undefined {
  const { api } = useApi();
  const trigger = useEventTrigger([api.events.uniques.Created, api.events.uniques.Destroyed]);

  return useMapKeys(api.query.uniques.class, { at: trigger.blockHash, transform: extractUniqueId });
}

export default createNamedHook('useUniqueIds', useUniqueIdsImpl);
