// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useCallback, useMemo } from 'react';

import store from 'store';
import useApi from './useApi';

// create a chain-specific key for the local cache
export default function useCacheKey <T> (storageKeyBase: string): [(defaultValue?: T) => T | undefined, (value: T) => T] {
  const { api, isDevelopment } = useApi();
  const storageKey = useMemo(
    () => `${storageKeyBase}:${isDevelopment ? 'development' : api.genesisHash.toHex()}`,
    [api, isDevelopment, storageKeyBase]
  );
  const getter = useCallback((): T | undefined => store.get(storageKey) as T, [storageKey]);
  const setter = useCallback((value: T): T => store.set(storageKey, value) as T, [storageKey]);

  return [getter, setter];
}
