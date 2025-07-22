// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const FAVORITE_CHAINS_KEY = 'polkadot-app-favorite-chains';

export const toggleFavoriteChain = (chainName: string) => {
  try {
    const favoriteChains = getFavoriteChains();
    const isAlreadyFavorite = favoriteChains.includes(chainName);

    const updatedChains = isAlreadyFavorite
      ? favoriteChains.filter((name) => name !== chainName)
      : [...favoriteChains, chainName];

    localStorage.setItem(FAVORITE_CHAINS_KEY, JSON.stringify(updatedChains));
  } catch (e) {
    console.error(e);
    // ignore error
  }
};

export const getFavoriteChains = (): string[] => {
  try {
    const favoriteChains = localStorage.getItem(FAVORITE_CHAINS_KEY);

    if (favoriteChains) {
      return JSON.parse(favoriteChains) as string[];
    }
  } catch (e) {
    localStorage.removeItem(FAVORITE_CHAINS_KEY);
    console.error(e);
    // ignore error
  }

  return [];
};
