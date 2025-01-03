// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { Balance } from '@polkadot/types/interfaces';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

function useBalanceImpl (accountId: string | null): Balance | undefined {
  const { api } = useApi();
  const balancesAll = useCall<DeriveBalancesAll>(api.derive.balances?.all, [accountId]);

  return balancesAll?.transferable || balancesAll?.availableBalance;
}

export const useBalance = createNamedHook('useBalance', useBalanceImpl);
