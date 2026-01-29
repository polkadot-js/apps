// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveAccountFlags } from '@polkadot/api-derive/types';
import type { AccountId, Address } from '@polkadot/types/interfaces';

import { createNamedHook } from './createNamedHook.js';
import { useCall } from './useCall.js';
import { useSystemApi } from './useSystemApi.js';

function useDeriveAccountFlagsImpl (value?: AccountId | Address | Uint8Array | string | null): DeriveAccountFlags | undefined {
  const api = useSystemApi();

  return useCall<DeriveAccountFlags>(api?.derive.accounts.flags, [value]);
}

export const useDeriveAccountFlags = createNamedHook('useDeriveAccountFlags', useDeriveAccountFlagsImpl);
