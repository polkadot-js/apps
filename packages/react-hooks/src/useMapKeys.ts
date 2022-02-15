// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { QueryableStorageEntry } from '@polkadot/api/types';

import { useEffect, useState } from 'react';

interface Options <T> {
  at?: string | null | false;
  transform?: (value: any[]) => T[];
}

// FIXME This is generic, we cannot really use createNamedHook
export function useMapKeys <T = any> (entry?: QueryableStorageEntry<'promise'> | null | false, { at, transform }: Options<T> = {}): T[] | undefined {
  const [state, setState] = useState<T[] | undefined>();

  useEffect((): void => {
    entry && (
      at && at !== '0'
        ? entry.keysAt(at)
        : entry.keys()
    ).then((keys) => setState(
      transform
        ? transform(keys)
        : keys as unknown as T[]
    )).catch(console.error);
  }, [at, entry, transform]);

  return state;
}
