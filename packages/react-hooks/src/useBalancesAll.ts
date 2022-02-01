// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';

import { createNamedHook } from './createNamedHook';
import { useApi } from './useApi';
import { useCall } from './useCall';

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
