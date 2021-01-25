// Copyright 2017-2021 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useMemo } from 'react';

import { useApi } from '@polkadot/react-hooks';

const DEFAULT_TIME = new BN(6000);
const A_DAY = new BN(24 * 60 * 60 * 1000);

export function useBlocksPerDays (days = 1): BN {
  const { api } = useApi();

  return useMemo(
    () => A_DAY.muln(days).div(
      api.consts.babe?.expectedBlockTime ||
      api.consts.difficulty?.targetBlockTime ||
      api.consts.timestamp?.minimumPeriod.muln(2) ||
      DEFAULT_TIME
    ),
    [api, days]
  );
}
