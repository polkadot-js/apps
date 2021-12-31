// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveAccountInfo } from '@polkadot/api-derive/types';
import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import { createNamedHook } from './createNamedHook';
import { useCall } from './useCall';
import { useSystemApi } from './useSystemApi';

function useDeriveAccountInfoImpl (value?: AccountId | AccountIndex | Address | Uint8Array | string | null): DeriveAccountInfo | undefined {
  const api = useSystemApi();

  return useCall<DeriveAccountInfo>(api.derive.accounts.info, [value]);
}

export const useDeriveAccountInfo = createNamedHook('useDeriveAccountInfo', useDeriveAccountInfoImpl);
