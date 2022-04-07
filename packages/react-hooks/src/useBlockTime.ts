// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { ApiPromise } from '@polkadot/api';
import type { Time } from '@polkadot/util/types';

import { useMemo } from 'react';

import { BN, BN_MAX_INTEGER, BN_ONE, bnMin, bnToBn, extractTime } from '@polkadot/util';

import { createNamedHook } from './createNamedHook';
import { useTranslation } from './translate';
import { useBlockInterval } from './useBlockInterval';

type Result = [number, string, Time];

function calcResult (blockTime: BN, blocks: BN, t: TFunction): Result {
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
          ? t<string>('{{days}} days', { replace: { days } })
          : t<string>('1 day')
        : null,
      hours
        ? (hours > 1)
          ? t<string>('{{hours}} hrs', { replace: { hours } })
          : t<string>('1 hr')
        : null,
      minutes
        ? (minutes > 1)
          ? t<string>('{{minutes}} mins', { replace: { minutes } })
          : t<string>('1 min')
        : null,
      seconds
        ? (seconds > 1)
          ? t<string>('{{seconds}} s', { replace: { seconds } })
          : t<string>('1 s')
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
    () => calcResult(blockTime, bnToBn(blocks), t),
    [blockTime, blocks, t]
  );
}

export const useBlockTime = createNamedHook('useBlockTime', useBlockTimeImpl);
