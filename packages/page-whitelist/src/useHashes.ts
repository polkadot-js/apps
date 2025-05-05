// Copyright 2017-2025 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Changes } from '@polkadot/react-hooks/useEventChanges';
import type { StorageKey } from '@polkadot/types';
import type { EventRecord, Hash } from '@polkadot/types/interfaces';
import type { HexString } from '@polkadot/util/types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useEventChanges, useMapKeys } from '@polkadot/react-hooks';

const OPT_HASH = {
  transform: (keys: StorageKey<[Hash]>[]): Hash[] =>
    keys.map(({ args: [hash] }) => hash)
};

function filter (records: EventRecord[]): Changes<Hash> {
  const added: Hash[] = [];
  const removed: Hash[] = [];

  records.forEach(({ event: { data: [hash], method } }): void => {
    if (method === 'CallWhitelisted') {
      added.push(hash as Hash);
    } else {
      removed.push(hash as Hash);
    }
  });

  return { added, removed };
}

function useHashesImpl (): HexString[] | undefined {
  const { api } = useApi();
  const startValue = useMapKeys(api.query.whitelist.whitelistedCall, [], OPT_HASH);
  const hashes = useEventChanges([
    api.events.whitelist.CallWhitelisted,
    api.events.whitelist.WhitelistedCallRemoved
  ], filter, startValue);

  return useMemo(
    () => hashes?.map((h) => h.toHex()),
    [hashes]
  );
}

export default createNamedHook('useHashes', useHashesImpl);
