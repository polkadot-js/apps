// Copyright 2017-2020 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balance } from '@polkadot/types/interfaces';

import React, { createContext, SetStateAction, useContext } from 'react';

export type BalanceApi = {
  accountId: string | null, balance?: Balance, setAccountId: React.Dispatch<SetStateAction<string | null>>
};

export const BalanceContext = createContext<BalanceApi>({} as BalanceApi);

export function useBalanceContext (): BalanceApi {
  return useContext(BalanceContext);
}
