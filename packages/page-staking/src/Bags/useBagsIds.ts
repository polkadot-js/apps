// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageKey, u64 } from '@polkadot/types';
import type { BN } from '@polkadot/util';

import { createNamedHook, useApi, useMapKeys } from '@polkadot/react-hooks';

const KEY_OPTS = {
  transform: (keys: StorageKey<[u64]>[]): BN[] =>
    keys.map(({ args: [id] }) => id)
};

function useBagsIdsImpl (): BN[] | undefined {
  const { api } = useApi();

  return useMapKeys(api.query.bagsList.listBags, KEY_OPTS);
}

export default createNamedHook('useBagsIds', useBagsIdsImpl);
