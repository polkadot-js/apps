// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Addresses } from './ctx/types';

import { useContext } from 'react';

import { KeyringCtx } from './ctx/Keyring';
import { createNamedHook } from './createNamedHook';

function useAddressesImpl (): Addresses {
  return useContext(KeyringCtx).addresses;
}

export const useAddresses = createNamedHook('useAddresses', useAddressesImpl);
