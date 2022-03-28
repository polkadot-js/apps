// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageKey, u64 } from '@polkadot/types';

import { createNamedHook, useApi, useMapKeys } from '@polkadot/react-hooks';

const keyOptions = {
  transform: (keys: StorageKey<[u64]>[]): u64[] =>
    keys.map(({ args: [id] }) => id)
};

function useBagsIdsImpl (): u64[] | undefined {
  const { api } = useApi();

  return useMapKeys(api.query.bagsList.listBags, keyOptions);
}

export default createNamedHook('useBagsIds', useBagsIdsImpl);
