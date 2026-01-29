// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingAccount } from '@polkadot/api-derive/types';

import { createNamedHook } from './createNamedHook.js';
import { useApi } from './useApi.js';
import { useCall } from './useCall.js';

function useStakingInfoImpl (accountId: string | null): DeriveStakingAccount | undefined {
  const { api } = useApi();

  return useCall<DeriveStakingAccount>(api.derive.staking?.account, [accountId]);
}

export const useStakingInfo = createNamedHook('useStakingInfo', useStakingInfoImpl);
