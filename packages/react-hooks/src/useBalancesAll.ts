// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';

import { useEffect, useState } from 'react';

import { all } from './utils/balancesAll.js';
import { createNamedHook } from './createNamedHook.js';
import { useApi } from './useApi.js';
import { useStakingAsyncApis } from './useStakingAsyncApis.js';

/**
 * Gets the account full balance information
 *
 * @param accountAddress The account address of which balance is to be returned
 * @returns full information about account's balances
 */
function useBalancesAllImpl (accountAddress: string): DeriveBalancesAll | undefined {
  const { api } = useApi();
  const [result, setResult] = useState<DeriveBalancesAll>();
  const { isStakingAsync, rcApi } = useStakingAsyncApis();

  useEffect(() => {
    if (isStakingAsync && !rcApi) {
      return;
    }

    const sub = all('StakingAsyncBalances' + Date.now(), api, isStakingAsync ? rcApi : undefined)(accountAddress)
      .subscribe({
        error: console.error,
        next: (allBalances) => {
          setResult(allBalances);
        }
      });

    return () => sub.unsubscribe();
  }, [accountAddress, api, isStakingAsync, rcApi]);

  return result;
}

export const useBalancesAll = createNamedHook('useBalancesAll', useBalancesAllImpl);
