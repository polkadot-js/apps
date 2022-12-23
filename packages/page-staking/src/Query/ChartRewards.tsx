// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveEraRewards, DeriveOwnSlashes, DeriveStakerPoints } from '@polkadot/api-derive/types';
import type { ChartInfo, LineDataEntry, Props } from './types';

import React, { useEffect, useMemo, useState } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { BN, formatBalance } from '@polkadot/util';

import { useTranslation } from '../translate';
import Chart from './Chart';
import { balanceToNumber } from './util';

const COLORS_REWARD = ['#8c2200', '#008c22', '#acacac'];

function extractRewards (erasRewards: DeriveEraRewards[] = [], ownSlashes: DeriveOwnSlashes[] = [], allPoints: DeriveStakerPoints[] = [], divisor: BN): ChartInfo {
  const labels: string[] = [];
  const slashSet: LineDataEntry = [];
  const rewardSet: LineDataEntry = [];
  const avgSet: LineDataEntry = [];
  const [total, avgCount] = erasRewards.reduce(([total, avgCount], { era, eraReward }) => {
    const points = allPoints.find((points) => points.era.eq(era));
    const reward = points?.eraPoints.gtn(0)
      ? balanceToNumber(points.points.mul(eraReward).div(points.eraPoints), divisor)
      : 0;

    if (reward > 0) {
      total += reward;
      avgCount++;
    }

    return [total, avgCount];
  }, [0, 0]);

  erasRewards.forEach(({ era, eraReward }): void => {
    const points = allPoints.find((points) => points.era.eq(era));
    const slashed = ownSlashes.find((slash) => slash.era.eq(era));
    const reward = points?.eraPoints.gtn(0)
      ? balanceToNumber(points.points.mul(eraReward).div(points.eraPoints), divisor)
      : 0;
    const slash = slashed
      ? balanceToNumber(slashed.total, divisor)
      : 0;
    const avg = avgCount > 0
      ? Math.ceil(total * 100 / avgCount) / 100
      : 0;

    labels.push(era.toHuman());
    rewardSet.push(reward);
    avgSet.push(avg);
    slashSet.push(slash);
  });

  return {
    labels,
    values: [slashSet, rewardSet, avgSet]
  };
}

function ChartRewards ({ validatorId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const params = useMemo(() => [validatorId, false], [validatorId]);
  const ownSlashes = useCall<DeriveOwnSlashes[]>(api.derive.staking.ownSlashes, params);
  const erasRewards = useCall<DeriveEraRewards[]>(api.derive.staking.erasRewards);
  const stakerPoints = useCall<DeriveStakerPoints[]>(api.derive.staking.stakerPoints, params);
  const [chart, setChart] = useState<ChartInfo>({ labels: [], values: [] });

  const { currency, divisor } = useMemo(
    () => ({
      currency: formatBalance.getDefaults().unit,
      divisor: new BN('1'.padEnd(formatBalance.getDefaults().decimals + 1, '0'))
    }),
    []
  );

  useEffect(
    () => setChart({ labels: [], values: [] }),
    [validatorId]
  );

  useEffect(
    () => setChart(extractRewards(erasRewards, ownSlashes, stakerPoints, divisor)),
    [divisor, erasRewards, ownSlashes, stakerPoints]
  );

  const legends = useMemo(() => [
    t<string>('{{currency}} slashed', { replace: { currency } }),
    t<string>('{{currency}} rewards', { replace: { currency } }),
    t<string>('{{currency}} average', { replace: { currency } })
  ], [currency, t]);

  return (
    <Chart
      chart={chart}
      colors={COLORS_REWARD}
      header={t<string>('rewards & slashes')}
      legends={legends}
    />
  );
}

export default React.memo(ChartRewards);
