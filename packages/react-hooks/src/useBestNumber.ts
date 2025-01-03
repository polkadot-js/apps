// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber } from '@polkadot/types/interfaces';

import { createNamedHook } from './createNamedHook.js';
import { useApi } from './useApi.js';
import { useCall } from './useCall.js';

function useBestNumberImpl (): BlockNumber | undefined {
  const { api } = useApi();

  return useCall<BlockNumber>(api.derive.chain.bestNumber);
}

export const useBestNumber = createNamedHook('useBestNumber', useBestNumberImpl);
