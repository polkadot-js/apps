// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { BN } from '@polkadot/util';
import type { Time } from '@polkadot/util/types';

import { useMemo } from 'react';

import { BN_MAX_INTEGER, BN_ONE, bnMin, bnToBn, extractTime } from '@polkadot/util';

import { createNamedHook } from './createNamedHook.js';
import { useTranslation } from './translate.js';
import { useBlockInterval } from './useBlockInterval.js';

type Result = [blockInterval: number, timeStr: string, time: Time];

export function calcBlockTime (blockTime: BN, blocks: BN, t: (key: string, options?: { replace: Record<string, unknown> }) => string): Result {
  // in the case of excessively large locks, limit to the max JS integer value
  const value = bnMin(BN_MAX_INTEGER, blockTime.mul(blocks)).toNumber();

  // time calculations are using the absolute value (< 0 detection only on strings)
  const time = extractTime(Math.abs(value));
  const { days, hours, minutes, seconds } = time;

  return [
    blockTime.toNumber(),
    `${value < 0 ? '+' : ''}${[
      days
        ? (days > 1)
          ? t('{{days}} days', { replace: { days } })
          : t('1 day')
        : null,
      hours
        ? (hours > 1)
          ? t('{{hours}} hrs', { replace: { hours } })
          : t('1 hr')
        : null,
      minutes
        ? (minutes > 1)
          ? t('{{minutes}} mins', { replace: { minutes } })
          : t('1 min')
        : null,
      seconds
        ? (seconds > 1)
          ? t('{{seconds}} s', { replace: { seconds } })
          : t('1 s')
        : null
    ]
      .filter((s): s is string => !!s)
      .slice(0, 2)
      .join(' ')}`,
    time
  ];
}

function useBlockTimeImpl (blocks: number | BN = BN_ONE, apiOverride?: ApiPromise | null): Result {
  const { t } = useTranslation();
  const blockTime = useBlockInterval(apiOverride);

  return useMemo(
    () => calcBlockTime(blockTime, bnToBn(blocks), t),
    [blockTime, blocks, t]
  );
}

export const useBlockTime = createNamedHook('useBlockTime', useBlockTimeImpl);
