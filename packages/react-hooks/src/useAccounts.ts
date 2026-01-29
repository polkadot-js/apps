// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Accounts } from './ctx/types.js';

import { useContext } from 'react';

import { KeyringCtx } from './ctx/Keyring.js';
import { createNamedHook } from './createNamedHook.js';

function useAccountsImpl (): Accounts {
  return useContext(KeyringCtx).accounts;
}

export const useAccounts = createNamedHook('useAccounts', useAccountsImpl);
