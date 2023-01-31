// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletStakingEraRewardPoints } from '@polkadot/types/lookup';
import type { SessionInfo } from '../types';
import type { UsePoints } from './types';

import { useEffect, useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

interface Cache {
  activeEra: SessionInfo['activeEra'];
  points?: UsePoints;
}

const OPT_POINTS = {
  transform: ({ individual }: PalletStakingEraRewardPoints): UsePoints =>
    [...individual.entries()]
      .filter(([, points]) => points.gt(BN_ZERO))
      .reduce((result: UsePoints, [stashId, points]): UsePoints => {
        result[stashId.toString()] = points.toNumber();

        return result;
      }, {})
};

const cached: Cache = {
  activeEra: null
};

function usePointsImpl ({ activeEra }: SessionInfo): UsePoints | undefined {
  const { api } = useApi();

  const queryParams = useMemo(
    () => activeEra && [activeEra],
    [activeEra]
  );

  const points = useCall(queryParams && api.query.staking.erasRewardPoints, queryParams, OPT_POINTS);

  useEffect((): void => {
    if (activeEra && points) {
      cached.activeEra = activeEra;
      cached.points = points;
    }
  }, [activeEra, points]);

  return useMemo(
    () => points || (
      activeEra &&
      cached.activeEra &&
      cached.activeEra.eq(activeEra) &&
      cached.points
    ) || undefined,
    [activeEra, points]
  );
}

export default createNamedHook('usePoints', usePointsImpl);
