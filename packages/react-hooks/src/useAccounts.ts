// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Accounts } from './ctx/types';

import { useContext } from 'react';

import { AccountsContext } from './ctx/Accounts';
import { createNamedHook } from './createNamedHook';

function useAccountsImpl (): Accounts {
  return useContext(AccountsContext);
}

export const useAccounts = createNamedHook('useAccounts', useAccountsImpl);
