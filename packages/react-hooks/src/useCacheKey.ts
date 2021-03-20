// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useMemo } from 'react';
import store from 'store';

import { useApi } from './useApi';

// create a chain-specific key for the local cache
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
