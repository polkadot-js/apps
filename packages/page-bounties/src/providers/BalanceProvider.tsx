// Copyright 2017-2020 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { ReactElement, ReactNode, useState } from 'react';

import { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { useApi, useCall } from '@polkadot/react-hooks';

import { BalanceApi, BalanceContext } from './BalanceContext';

export function BalanceProvider ({ children }: { children: ReactNode }): ReactElement {
  const { api } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const balances = useCall<DeriveBalancesAll>(api.derive.balances.all, [accountId]);

  const balanceApi: BalanceApi = {
    accountId,
    balance: balances?.availableBalance,
    setAccountId
  };

  return <BalanceContext.Provider value={balanceApi} >
    {children}
  </BalanceContext.Provider>;
}
