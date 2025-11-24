// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber } from '@polkadot/types/interfaces';

import { createNamedHook } from './createNamedHook.js';
import { useApi } from './useApi.js';
import { useCall } from './useCall.js';
import { useStakingAsyncApis } from './useStakingAsyncApis.js';

function useBestNumberImpl (): BlockNumber | undefined {
  const { api } = useApi();

  return useCall<BlockNumber>(api.derive.chain.bestNumber);
}

function useBestNumberRelayImpl (): BlockNumber | undefined {
  const { api } = useApi();
  const { isStakingAsync, rcApi } = useStakingAsyncApis();

  return useCall<BlockNumber>((isStakingAsync ? rcApi : api)?.derive.chain.bestNumber);
}

export const useBestNumber = createNamedHook('useBestNumber', useBestNumberImpl);
export const useBestNumberRelay = createNamedHook('useBestNumberRelay', useBestNumberRelayImpl);
