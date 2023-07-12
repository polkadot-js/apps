// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createNamedHook } from './createNamedHook.js';
import { useApi } from './useApi.js';
import { useCall } from './useCall.js';

function useStakingInfoImpl (accountId: string | null) {
  const { api } = useApi();

  return useCall(api.derive.staking?.account, [accountId]);
}

export const useStakingInfo = createNamedHook('useStakingInfo', useStakingInfoImpl);
