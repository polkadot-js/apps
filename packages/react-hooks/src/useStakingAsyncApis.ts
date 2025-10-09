// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StakingAsyncApis } from './ctx/types.js';

import { useContext } from 'react';

import { StakingAsyncApisCtx } from './ctx/StakingAsync.js';
import { createNamedHook } from './createNamedHook.js';

function useStakingAsyncApisImpl (): StakingAsyncApis {
  return useContext(StakingAsyncApisCtx);
}

export const useStakingAsyncApis = createNamedHook('useStakingAsyncApis', useStakingAsyncApisImpl);
