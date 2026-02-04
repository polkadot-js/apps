// Copyright 2017-2026 @polkadot/app-price-oracle authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageKey } from '@polkadot/types';
import type { Codec } from '@polkadot/types/types';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

export interface TimePoint {
  local: string;
  relay: string;
  timestamp: string;
}

export interface PriceData {
  price: string;
  confidence: string;
  updatedIn: TimePoint;
}

export interface AssetPriceInfo {
  assetId: string;
  currentPrice: PriceData | null;
  priceHistory: PriceData[];
}

// Hook to get list of tracked asset IDs
function useTrackedAssetsImpl (): string[] | undefined {
  const { api, isApiReady } = useApi();

  // Get all endpoints entries (this gives us the tracked asset IDs)
  const endpointsEntries = useCall<[StorageKey, Codec][]>(
    isApiReady && api.query.priceOracle?.endpoints?.entries
  );

  if (!endpointsEntries) {
    return undefined;
  }

  return endpointsEntries.map(([key]) => key.args[0].toString());
}

export const useTrackedAssets = createNamedHook('useTrackedAssets', useTrackedAssetsImpl);

// Hook to get price data for a specific asset (with subscriptions for reactivity)
function useAssetPriceDataImpl (assetId: string | null): AssetPriceInfo | undefined {
  const { api, isApiReady } = useApi();

  // Subscribe to current price (reactive)
  const priceOption = useCall<Codec>(
    isApiReady && assetId && api.query.priceOracle?.price,
    [assetId]
  );

  // Subscribe to price history (reactive)
  const historyVec = useCall<Codec>(
    isApiReady && assetId && api.query.priceOracle?.priceHistory,
    [assetId]
  );

  if (!assetId || !priceOption || !historyVec) {
    return undefined;
  }

  const currentPrice = (priceOption as any).isSome
    ? ((priceOption as any).unwrap().toHuman() as PriceData)
    : null;

  const priceHistory = historyVec.toHuman() as PriceData[];

  return {
    assetId,
    currentPrice,
    priceHistory
  };
}

export const useAssetPriceData = createNamedHook('useAssetPriceData', useAssetPriceDataImpl);
