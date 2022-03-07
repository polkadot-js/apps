// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageKey } from '@polkadot/types';
import type { AccountId } from '@polkadot/types/interfaces';

import { createNamedHook, useApi, useEventTrigger, useMapKeys } from '@polkadot/react-hooks';
import { u8aCmp } from '@polkadot/util';

const options = {
  transform: (keys: StorageKey<[AccountId]>[]): AccountId[] =>
    keys
      .map(({ args: [accountId] }) => accountId)
      .sort((a, b) => u8aCmp(a, b))
};

function usePoolIdsImpl (): AccountId[] | undefined {
  const { api } = useApi();
  const trigger = useEventTrigger([
    api.events.nominationPools.Created,
    api.events.nominationPools.Destoryed
  ]);

  return useMapKeys(api.query.nominationPools.bondedPools, options, trigger.blockHash);
}

export default createNamedHook('usePoolIds', usePoolIdsImpl);
