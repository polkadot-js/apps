// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useState } from 'react';

import { createNamedHook } from './createNamedHook';
import { useCacheKey } from './useCacheKey';

// hook for favorites with local storage
function useFavoritesImpl (storageKeyBase: string): [string[], (address: string) => void] {
  const [getCache, setCache] = useCacheKey<string[]>(storageKeyBase);
  const [favorites, setFavorites] = useState<string[]>(() => getCache() || []);

  const toggleFavorite = useCallback(
    (address: string): void => setFavorites(
      (favorites) => setCache(
        favorites.includes(address)
          ? favorites.filter((a) => address !== a)
          : [...favorites, address]
      )
    ),
    [setCache]
  );

  return [favorites, toggleFavorite];
}

export const useFavorites = createNamedHook('useFavorites', useFavoritesImpl);
