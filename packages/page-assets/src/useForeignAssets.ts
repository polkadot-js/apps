// Copyright 2017-2025 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageKey, u32 } from '@polkadot/types';
import type { AnyJson } from '@polkadot/types-codec/types';

import { createNamedHook, useApi, useMapKeys } from '@polkadot/react-hooks';

const EMPTY_PARAMS: unknown[] = [];

const OPT_KEY = {
  transform: (keys: StorageKey<[u32]>[]): AnyJson[] =>
    keys.map((entry) => entry.toHuman())
};

function useForeignAssetsImpl () {
  const { api, isApiReady } = useApi();

  const values = useMapKeys(isApiReady && api.query.foreignAssets?.asset, EMPTY_PARAMS, OPT_KEY) || [];

  return values;
}

export const useForeignAssets = createNamedHook('useForeignAssets', useForeignAssetsImpl);
