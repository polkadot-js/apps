// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IFavoriteChainProps, IFavoriteChainsStorage } from './types.js';

export const FAVORITE_CHAINS_KEY = 'polkadot-app-favorite-chains';

export const toggleFavoriteChain = (
  chainInfo: IFavoriteChainProps
) => {
  try {
    const chainName = chainInfo.chainName;
    const meta = { paraId: chainInfo.paraId ?? -1, relay: chainInfo.relay ?? 'Unknown' };

    const favoriteChains = getFavoriteChains();
    const existingEntries = favoriteChains[chainName] ?? [];

    const alreadyExists = existingEntries.some(
      (entry) => entry.relay === meta.relay && entry.paraId === meta.paraId
    );

    let updatedEntries: IFavoriteChainsStorage[string];

    if (alreadyExists) {
      // Remove the matching entry
      updatedEntries = existingEntries.filter(
        (entry) => entry.relay !== meta.relay || entry.paraId !== meta.paraId
      );
    } else {
      // Add new entry
      updatedEntries = [...existingEntries, meta];
    }

    const updatedChains: IFavoriteChainsStorage = { ...favoriteChains };

    if (updatedEntries.length === 0) {
      delete updatedChains[chainName];
    } else {
      updatedChains[chainName] = updatedEntries;
    }

    localStorage.setItem(FAVORITE_CHAINS_KEY, JSON.stringify(updatedChains));
  } catch {}
};

export const getFavoriteChains = (): IFavoriteChainsStorage => {
  try {
    const favoriteChains = localStorage.getItem(FAVORITE_CHAINS_KEY);

    if (!favoriteChains) {
      return {};
    }

    const parsed: unknown = JSON.parse(favoriteChains);

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new Error('Invalid favorite chains format');
    }

    const result: IFavoriteChainsStorage = {};

    for (const [key, value] of Object.entries(parsed)) {
      if (!Array.isArray(value)) {
        throw new Error(`Invalid value for key "${key}": not an array`);
      }

      const allValid = value.every(
        (entry: IFavoriteChainsStorage[string][number]) =>
          typeof entry === 'object' &&
          entry !== null &&
          typeof entry.relay === 'string' &&
          typeof entry.paraId === 'number'
      );

      if (!allValid) {
        throw new Error(`Invalid entries under key "${key}"`);
      }

      result[key] = value as IFavoriteChainsStorage[string];
    }

    return result;
  } catch (e) {
    console.error('Failed to parse favorite chains:', e);
    localStorage.removeItem(FAVORITE_CHAINS_KEY);

    return {};
  }
};

export const isFavoriteChain = (
  favoriteChains: IFavoriteChainsStorage,
  chainInfo: IFavoriteChainProps
): boolean => {
  try {
    const chainName = chainInfo.chainName;
    const meta = { paraId: chainInfo.paraId ?? -1, relay: chainInfo.relay ?? 'Unknown' };

    const list = favoriteChains[chainName];

    if (!Array.isArray(list)) {
      return false;
    }

    return list.some(
      (entry) =>
        entry.relay === meta.relay && entry.paraId === meta.paraId
    );
  } catch (e) {
    console.error('Failed to check favorite chain:', e);

    return false;
  }
};

export function getContrastingColor (hexColor: string): string {
  if (typeof hexColor !== 'string') {
    return '#000000';
  }

  let hex = hexColor.replace('#', '').trim();

  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }

  if (hex.length !== 6 || /[^0-9a-f]/i.test(hex)) {
    return '#000000';
  }

  try {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  } catch {
    return '#000000';
  }
}
