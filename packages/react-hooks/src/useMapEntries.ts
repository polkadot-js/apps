// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { QueryableStorageEntry } from '@polkadot/api/types';

import { useEffect, useState } from 'react';

interface Options <T> {
  at?: string | null | false;
  transform?: (value: any[]) => T;
}

export function useMapEntries <T = any> (entry?: QueryableStorageEntry<'promise'> | null | false, { at, transform }: Options<T> = {}): T | undefined {
  const [state, setState] = useState<T | undefined>();

  useEffect((): void => {
    entry && (
      at && at !== '0'
        ? entry.entriesAt(at)
        : entry.entries()
    ).then((entries) => setState(
      transform
        ? transform(entries)
        : entries as unknown as T
    )).catch(console.error);
  }, [at, entry, transform]);

  return state;
}
