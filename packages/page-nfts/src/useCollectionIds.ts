// Copyright 2017-2023 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AugmentedEvents, AugmentedQueries } from '@polkadot/api-base/types';
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
  const { api, apiDefaultNft } = useApi();
  const queryNfts = api.query[apiDefaultNft] as AugmentedQueries<'promise'>['uniques'];
  const nftEvents = api.events[apiDefaultNft] as AugmentedEvents<'promise'>['uniques'];

  const startValue = useMapKeys(queryNfts.class, [], OPT_KEYS);

  return useEventChanges([
    nftEvents.Created,
    nftEvents.Destroyed,
    nftEvents.ForceCreated
  ], filter, startValue);
}

export default createNamedHook('useCollectionIds', useCollectionIdsImpl);
