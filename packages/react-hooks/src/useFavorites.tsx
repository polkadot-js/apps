// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useState } from 'react';

import useCacheKey from './useCacheKey';

// hook for favorites with local storage
export default function useFavorites (storageKeyBase: string): [string[], (address: string) => void] {
  const [getCache, setCache] = useCacheKey<string[]>(storageKeyBase);
  const [favorites, setFavorites] = useState<string[]>(getCache() || []);

  const _toggleFavorite = (address: string): void =>
    setFavorites(
      setCache(
        favorites.includes(address)
          ? favorites.filter((accountId): boolean => address !== accountId)
          : [...favorites, address]
      )
    );

  return [favorites, _toggleFavorite];
}
