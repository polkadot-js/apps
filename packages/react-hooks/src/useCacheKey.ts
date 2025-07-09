// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useMemo } from 'react';
import store from 'store';

import { useApi } from './useApi.js';

// create a chain-specific key for the local cache
// FIXME Since we use generics, this cannot be a createNamedHook as of yet
export function useCacheKey <T> (storageKeyBase: string): [(defaultValue?: T) => T | undefined, (value: T) => T] {
  const { api, isDevelopment } = useApi();
  const storageKey = useMemo(
    () => `${storageKeyBase}:${isDevelopment ? 'development' : api.genesisHash.toHex()}`,
    [api, isDevelopment, storageKeyBase]
  );

  // FIXME both these want "T"... incorrect

  const getter = useCallback(
    (): T | undefined => store.get(storageKey) as T,
    [storageKey]
  );

  const setter = useCallback(
    (value: T): T => store.set(storageKey, value) as T,
    [storageKey]
  );

  return [getter, setter];
}
