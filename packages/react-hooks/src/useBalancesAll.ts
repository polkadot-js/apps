// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';

import { createNamedHook } from './createNamedHook.js';
import { useApi } from './useApi.js';
import { useCall } from './useCall.js';

/**
 * Gets the account full balance information
 *
 * @param accountAddress The account address of which balance is to be returned
 * @returns full information about account's balances
 */
function useBalancesAllImpl (accountAddress: string): DeriveBalancesAll | undefined {
  const { api } = useApi();

  return useCall<DeriveBalancesAll>(api.derive.balances?.all, [accountAddress]);
}

export const useBalancesAll = createNamedHook('useBalancesAll', useBalancesAllImpl);
