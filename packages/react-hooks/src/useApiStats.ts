// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiStats } from './ctx/types';

import { useContext } from 'react';

import { ApiStatsContext } from './ctx/ApiStats';
import { createNamedHook } from './createNamedHook';

function useApiStatsImpl (): ApiStats[] {
  return useContext(ApiStatsContext);
}

export const useApiStats = createNamedHook('useApiStats', useApiStatsImpl);
