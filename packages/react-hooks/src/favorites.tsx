// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useState } from 'react';
import store from 'store';

import useApiContext from './apiContext';

// hook for favorites with local storage
export default function useFavorites (storageKeyBase: string): [string[], (address: string) => void] {
  const { api, isDevelopment } = useApiContext();
  const keyName = `${storageKeyBase}:${isDevelopment ? 'development' : api.genesisHash}`;

  // retrieve from the new style first, if not available, fallback to old-style
  const [favorites, setFavorites] = useState<string[]>(store.get(keyName) || store.get(storageKeyBase, []));

  const _toggleFavorite = (address: string): void =>
    setFavorites(
      store.set(
        keyName,
        favorites.includes(address)
          ? favorites.filter((accountId): boolean => address !== accountId)
          : [...favorites, address]
      )
    );

  return [favorites, _toggleFavorite];
}
