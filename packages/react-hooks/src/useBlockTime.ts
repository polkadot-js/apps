// Copyright 2017-2021 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Time } from '@polkadot/util/types';

import BN from 'bn.js';
import { useMemo } from 'react';

import { useApi } from '@polkadot/react-hooks';
import { BN_ONE, extractTime } from '@polkadot/util';

import { useTranslation } from './translate';

type Result = [number, string, Time];

const DEFAULT_TIME = new BN(6000);

export function useBlockTime (blocks = BN_ONE, apiOverride?: ApiPromise): Result {
  const { t } = useTranslation();
  const { api } = useApi();

  return useMemo(
    (): Result => {
      const a = apiOverride || api;
      const blockTime = (
        a.consts.babe?.expectedBlockTime ||
        a.consts.difficulty?.targetBlockTime ||
        a.consts.timestamp?.minimumPeriod.muln(2) ||
        DEFAULT_TIME
      );
      const value = blockTime.mul(blocks).toNumber();
      const prefix = value < 0 ? '+' : '';
      const time = extractTime(Math.abs(value));
      const { days, hours, minutes, seconds } = time;
      const timeStr = [
        days ? (days > 1) ? t<string>('{{days}} days', { replace: { days } }) : t<string>('1 day') : null,
        hours ? (hours > 1) ? t<string>('{{hours}} hrs', { replace: { hours } }) : t<string>('1 hr') : null,
        minutes ? (minutes > 1) ? t<string>('{{minutes}} mins', { replace: { minutes } }) : t<string>('1 min') : null,
        seconds ? (seconds > 1) ? t<string>('{{seconds}} s', { replace: { seconds } }) : t<string>('1 s') : null
      ]
        .filter((value): value is string => !!value)
        .slice(0, 2)
        .join(' ');

      return [
        blockTime.toNumber(),
        `${prefix}${timeStr}`,
        time
      ];
    },
    [api, apiOverride, blocks, t]
  );
}
