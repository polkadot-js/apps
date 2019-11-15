// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useState } from 'react';
import store from 'store';

import useCacheKey from './cacheKey';

// hook for favorites with local storage
export default function useFavorites (storageKeyBase: string): [string[], (address: string) => void] {
  const STORAGE_KEY = useCacheKey(storageKeyBase);

  // retrieve from the new style first, if not available, fallback to old-style
  const [favorites, setFavorites] = useState<string[]>(store.get(STORAGE_KEY) || store.get(storageKeyBase, []));

  const _toggleFavorite = (address: string): void =>
    setFavorites(
      store.set(
        STORAGE_KEY,
        favorites.includes(address)
          ? favorites.filter((accountId): boolean => address !== accountId)
          : [...favorites, address]
      )
    );

  return [favorites, _toggleFavorite];
}
