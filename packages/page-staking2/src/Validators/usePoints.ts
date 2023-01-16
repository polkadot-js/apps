// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletStakingEraRewardPoints } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { BN_ZERO, formatNumber } from '@polkadot/util';

type Result = Record<string, string>;

const OPT_POINTS = {
  transform: ({ individual }: PalletStakingEraRewardPoints): Result =>
    [...individual.entries()]
      .filter(([, points]) => points.gt(BN_ZERO))
      .reduce((result: Result, [stashId, points]): Result => {
        result[stashId.toString()] = formatNumber(points);

        return result;
      }, {})
};

function usePointsImpl (activeEra: BN | null): Result | undefined {
  const { api } = useApi();

  const pointsParams = useMemo(
    () => activeEra && [activeEra],
    [activeEra]
  );

  return useCall(activeEra && api.query.staking.erasRewardPoints, pointsParams, OPT_POINTS);
}

export default createNamedHook('usePoints', usePointsImpl);
