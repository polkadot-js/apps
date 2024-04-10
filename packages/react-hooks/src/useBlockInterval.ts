// Copyright 2017-2024 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { BabeGenesisConfiguration } from '@polkadot/types/interfaces/babe';

import { useMemo } from 'react';

import { BN } from '@polkadot/util';

import { createNamedHook } from './createNamedHook.js';
import { useApi } from './useApi.js';
import { useCall } from './useCall.js';

function useBlockIntervalImpl (apiOverride?: ApiPromise | null): BN {
  let { api } = useApi();

  api = apiOverride || api;
  const blockTimeAura = useCall(api.call.auraApi?.slotDuration && api.call.auraApi.slotDuration, []);
  const blockTimeBabe = useCall(api.call.babeApi?.configuration && api.call.babeApi.configuration, [], {
    transform: (data: BabeGenesisConfiguration | undefined) => data?.slotDuration
  });

  return useMemo(
    () => (blockTimeAura || blockTimeBabe) ?? new BN(6_000),
    [blockTimeAura, blockTimeBabe]
  ) as BN;
}

export const useBlockInterval = createNamedHook('useBlockInterval', useBlockIntervalImpl);
