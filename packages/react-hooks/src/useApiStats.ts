// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiStats } from './ctx/types.js';

import { useContext } from 'react';

import { ApiStatsCtx } from './ctx/ApiStats.js';
import { createNamedHook } from './createNamedHook.js';

function useApiStatsImpl (): ApiStats[] {
  return useContext(ApiStatsCtx);
}

export const useApiStats = createNamedHook('useApiStats', useApiStatsImpl);
