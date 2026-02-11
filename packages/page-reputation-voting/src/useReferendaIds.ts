// Copyright 2017-2025 @polkadot/app-reputation-voting authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Changes } from '@polkadot/react-hooks/useEventChanges';
import type { StorageKey, u32 } from '@polkadot/types';
import type { EventRecord } from '@polkadot/types/interfaces';

import { createNamedHook, useApi, useEventChanges, useMapKeys } from '@polkadot/react-hooks';

const OPT_ID = {
  transform: (keys: StorageKey<[u32]>[]): u32[] =>
    keys.map(({ args: [id] }) => id)
};

function filter (records: EventRecord[]): Changes<u32> {
  const added: u32[] = [];
  const removed: u32[] = [];

  records.forEach(({ event: { data: [id], method } }): void => {
    if (method === 'Submitted') {
      added.push(id as u32);
    } else {
      removed.push(id as u32);
    }
  });

  return { added, removed };
}

function useReferendaIdsImpl (): u32[] | undefined {
  const { api } = useApi();
  const startValue = useMapKeys(api.query.referenda.referendumInfoFor, [], OPT_ID);

  return useEventChanges([
    api.events.referenda.Submitted,
    api.events.referenda.Approved,
    api.events.referenda.Rejected,
    api.events.referenda.Cancelled,
    api.events.referenda.TimedOut,
    api.events.referenda.Killed
  ], filter, startValue);
}

export default createNamedHook('useReferendaIds', useReferendaIdsImpl);
