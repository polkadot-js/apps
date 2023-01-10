// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { QueryableStorageEntry } from '@polkadot/api/types';

import { useEffect, useState } from 'react';

import { useMemoValue } from './useMemoValue';

interface Options <T> {
  transform?: (value: any[]) => T;
}

// FIXME This is generic, we cannot really use createNamedHook
export function useMapEntries <T = any> (entry: QueryableStorageEntry<'promise'> | null | false | undefined, params: unknown[], { transform }: Options<T> = {}, at?: string | null | false): T | undefined {
  const [state, setState] = useState<T | undefined>();
  const memoParams = useMemoValue(params);

  useEffect(
    (): void => {
      entry && (
        at && at !== '0'
          // eslint-disable-next-line deprecation/deprecation
          ? entry.entriesAt(at, ...memoParams)
          : entry.entries(...memoParams)
      ).then((entries) => setState(
        transform
          ? transform(entries)
          : entries as unknown as T
      )).catch(console.error);
    },
    [at, entry, memoParams, transform]
  );

  return state;
}
