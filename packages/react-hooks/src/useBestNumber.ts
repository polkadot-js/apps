// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createNamedHook } from './createNamedHook.js';
import { useApi } from './useApi.js';
import { useCall } from './useCall.js';

function useBestNumberImpl () {
  const { api } = useApi();

  return useCall(api.derive.chain.bestNumber);
}

export const useBestNumber = createNamedHook('useBestNumber', useBestNumberImpl);
