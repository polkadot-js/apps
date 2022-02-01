// Copyright 2017-2022 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balance } from '@polkadot/types/interfaces';

import { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

function useBalanceImpl (accountId: string | null): Balance | undefined {
  const { api } = useApi();

  return useCall<DeriveBalancesAll>(api.derive.balances?.all, [accountId])?.availableBalance;
}

export const useBalance = createNamedHook('useBalance', useBalanceImpl);
