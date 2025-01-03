// Copyright 2017-2025 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Changes } from '@polkadot/react-hooks/useEventChanges';
import type { StorageKey } from '@polkadot/types';
import type { EventRecord, Hash } from '@polkadot/types/interfaces';
import type { HexString } from '@polkadot/util/types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useEventChanges, useMapKeys } from '@polkadot/react-hooks';

const EMPTY_PARAMS: unknown[] = [];

const OPT_HASH = {
  transform: (keys: StorageKey<[Hash]>[]): Hash[] =>
    keys.map(({ args: [hash] }) => hash)
};

function filter (records: EventRecord[]): Changes<Hash> {
  const added: Hash[] = [];
  const removed: Hash[] = [];

  records.forEach(({ event: { data: [hash], method } }): void => {
    if (method === 'Noted') {
      added.push(hash as Hash);
    } else {
      removed.push(hash as Hash);
    }
  });

  return { added, removed };
}

function usePreimagesImpl (): HexString[] | undefined {
  const { api } = useApi();
  const startValueStatusFor = useMapKeys(api.query.preimage.statusFor, EMPTY_PARAMS, OPT_HASH);
  const startvalueRequstStatusFor = useMapKeys(api.query.preimage.requestStatusFor, EMPTY_PARAMS, OPT_HASH);
  const hashes = useEventChanges([
    api.events.preimage.Cleared,
    api.events.preimage.Noted
  ], filter, startValueStatusFor?.concat(startvalueRequstStatusFor || []));

  return useMemo(
    () => hashes?.map((h) => h.toHex()),
    [hashes]
  );
}

export default createNamedHook('usePreimages', usePreimagesImpl);
