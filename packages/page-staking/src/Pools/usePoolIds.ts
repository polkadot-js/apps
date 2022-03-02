// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageKey } from '@polkadot/types';
import type { AccountId } from '@polkadot/types/interfaces';

import { createNamedHook, useApi, useEventTrigger, useMapKeys } from '@polkadot/react-hooks';
import { u8aCmp } from '@polkadot/util';

function transform (keys: StorageKey<[AccountId]>[]): AccountId[] {
  return keys
    .map(({ args: [accountId] }) => accountId)
    .sort((a, b) => u8aCmp(a, b));
}

function usePoolIdsImpl (): AccountId[] | undefined {
  const { api } = useApi();

  // FIXME??? There are actually no events atm for Create/Destroy, so
  // the list cannot trigger for updates as items are added
  const trigger = useEventTrigger([]);

  return useMapKeys(api.query.nominatorPools.bondedPools, {
    at: trigger.blockHash,
    transform
  });
}

export default createNamedHook('usePoolIds', usePoolIdsImpl);
