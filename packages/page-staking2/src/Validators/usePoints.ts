// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletStakingEraRewardPoints } from '@polkadot/types/lookup';
import type { SessionInfo } from '../types.js';
import type { UsePoints } from './types.js';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { useCacheValue } from '../useCache.js';

const OPT_POINTS = {
  transform: ({ individual }: PalletStakingEraRewardPoints): UsePoints =>
    [...individual.entries()]
      .filter(([, points]) => points.gt(BN_ZERO))
      .reduce((result: UsePoints, [stashId, points]): UsePoints => {
        result[stashId.toString()] = points.toNumber();

        return result;
      }, {})
};

function usePointsImpl ({ activeEra }: SessionInfo): UsePoints | undefined {
  const { api } = useApi();

  const queryParams = useMemo(
    () => activeEra && [activeEra],
    [activeEra]
  );

  const points = useCall(queryParams && api.query.staking.erasRewardPoints, queryParams, OPT_POINTS);

  return useCacheValue('usePoints', points);
}

export default createNamedHook('usePoints', usePointsImpl);
