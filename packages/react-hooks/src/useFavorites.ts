// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useState } from 'react';

import { useCacheKey } from './useCacheKey';

// hook for favorites with local storage
export function useFavorites (storageKeyBase: string): [string[], (address: string) => void] {
  const [getCache, setCache] = useCacheKey<string[]>(storageKeyBase);
  const [favorites, setFavorites] = useState<string[]>(() => getCache() || []);

  const toggleFavorite = useCallback(
    (address: string): void => setFavorites(
      (favorites: string[]) => setCache(
        favorites.includes(address)
          ? favorites.filter((accountId): boolean => address !== accountId)
          : [...favorites, address]
      )
    ),
    [setCache]
  );

  return [favorites, toggleFavorite];
}
