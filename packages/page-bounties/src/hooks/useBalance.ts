// Copyright 2017-2023 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

function useBalanceImpl (accountId: string | null) {
  const { api } = useApi();

  return useCall(api.derive.balances?.all, [accountId])?.availableBalance;
}

export const useBalance = createNamedHook('useBalance', useBalanceImpl);
