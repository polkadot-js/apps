// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, BalanceOf } from '@polkadot/types/interfaces';

import { createNamedHook } from './createNamedHook.js';
import { useApi } from './useApi.js';
import { useCall } from './useCall.js';

function useSubidentitiesImpl (address: string): AccountId[] | undefined {
  const { api } = useApi();

  return useCall<[BalanceOf, AccountId[]]>(api.query.identity?.subsOf, [address])?.[1];
}

export const useSubidentities = createNamedHook('useSubidentities', useSubidentitiesImpl);
