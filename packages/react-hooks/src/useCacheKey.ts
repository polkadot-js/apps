// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import store from 'store';
import useApi from './useApi';

// create a chain-specific key for the local cache
export default function useCacheKey <T> (storageKeyBase: string): [(defaultValue?: T) => T | undefined, (value: T) => T] {
  const { api, isDevelopment } = useApi();
  const STORAGE_KEY = `${storageKeyBase}:${isDevelopment ? 'development' : api.genesisHash}`;

  return [
    (): T | undefined => store.get(STORAGE_KEY),
    (value: T): T => store.set(STORAGE_KEY, value)
  ];
}
