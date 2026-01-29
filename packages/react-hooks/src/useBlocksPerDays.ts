// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import { BN, bnToBn } from '@polkadot/util';

import { createNamedHook } from './createNamedHook.js';
import { useBlockInterval } from './useBlockInterval.js';

export const A_DAY = new BN(24 * 60 * 60 * 1000);

function useBlocksPerDaysImpl (days: BN | number = 1): BN {
  const blockTime = useBlockInterval();

  return useMemo(
    () => A_DAY.mul(bnToBn(days)).div(blockTime),
    [blockTime, days]
  );
}

export const useBlocksPerDays = createNamedHook('useBlocksPerDays', useBlocksPerDaysImpl);
