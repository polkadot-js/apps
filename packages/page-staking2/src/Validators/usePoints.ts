// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletStakingEraRewardPoints } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

type Result = Record<string, number>;

const OPT_POINTS = {
  transform: ({ individual }: PalletStakingEraRewardPoints): Result =>
    [...individual.entries()]
      .filter(([, points]) => points.gt(BN_ZERO))
      .reduce((result: Result, [stashId, points]): Result => {
        result[stashId.toString()] = points.toNumber();

        return result;
      }, {})
};

function usePointsImpl (activeEra: BN | null): Result | undefined {
  const { api } = useApi();

  const queryParams = useMemo(
    () => activeEra && [activeEra],
    [activeEra]
  );

  return useCall(queryParams && api.query.staking.erasRewardPoints, queryParams, OPT_POINTS);
}

export default createNamedHook('usePoints', usePointsImpl);
