// Copyright 2017-2025 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageKey } from '@polkadot/types';
import type { StagingXcmV3MultiLocation } from '@polkadot/types/lookup';

import { createNamedHook, useApi, useMapKeys } from '@polkadot/react-hooks';

const EMPTY_PARAMS: unknown[] = [];

const OPT_KEY = {
  transform: (keys: StorageKey<[StagingXcmV3MultiLocation]>[]): StagingXcmV3MultiLocation[] =>
    keys.flatMap(({ args }) => args)
};

function useForeignAssetLocationsImpl () {
  const { api, isApiReady } = useApi();

  const values = useMapKeys(isApiReady && api.query.foreignAssets?.asset, EMPTY_PARAMS, OPT_KEY) || [];

  return values;
}

export const useForeignAssetLocations = createNamedHook('useForeignAssetLocations', useForeignAssetLocationsImpl);
