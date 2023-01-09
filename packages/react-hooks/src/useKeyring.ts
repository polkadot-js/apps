// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Accounts, Addresses } from './ctx/types';

import { useContext } from 'react';

import { KeyringCtx } from './ctx/Keyring';
import { createNamedHook } from './createNamedHook';

function useKeyringImpl (): { accounts: Accounts, addresses: Addresses } {
  return useContext(KeyringCtx);
}

export const useKeyring = createNamedHook('useKeyring', useKeyringImpl);
