// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useCallback, useState } from 'react';

import useCacheKey from './useCacheKey';

// hook for favorites with local storage
export default function useFavorites (storageKeyBase: string): [string[], (address: string) => void] {
  const [getCache, setCache] = useCacheKey<string[]>(storageKeyBase);
  const [favorites, setFavorites] = useState<string[]>(getCache() || []);

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
