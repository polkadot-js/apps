// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiStats } from './ctx/types';

import { useContext } from 'react';

import { ApiStatsCtx } from './ctx/ApiStats';
import { createNamedHook } from './createNamedHook';

function useApiStatsImpl (): ApiStats[] {
  return useContext(ApiStatsCtx);
}

export const useApiStats = createNamedHook('useApiStats', useApiStatsImpl);
