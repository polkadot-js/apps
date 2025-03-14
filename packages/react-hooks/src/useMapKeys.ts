// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { QueryableStorageEntry } from '@polkadot/api/types';

import { useEffect, useRef, useState } from 'react';

import { stringify } from '@polkadot/util';

interface Options <T> {
  transform?: (value: any[]) => T[];
}

// FIXME This is generic, we cannot really use createNamedHook
export function useMapKeys <T = any> (entry: QueryableStorageEntry<'promise'> | null | false | undefined, params?: unknown[] | null, { transform }: Options<T> = {}, at?: string | null | false): T[] | undefined {
  const [state, setState] = useState<T[] | undefined>();
  const checkRef = useRef<string | null>(null);

  useEffect((): void => {
    if (entry && params) {
      const check = stringify({ at, params });

      if (check !== checkRef.current) {
        checkRef.current = check;

        (
          at && at !== '0'
            // eslint-disable-next-line deprecation/deprecation
            ? entry.keysAt(at, ...params)
            : entry.keys(...params)
        ).then((keys) => setState(
          transform
            ? transform(keys)
            : keys as unknown as T[]
        )).catch(console.error);
      }
    }
  }, [at, entry, params, transform]);

  return state;
}
