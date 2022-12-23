// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakerPoints } from '@polkadot/api-derive/types';
import type { ChartInfo, LineDataEntry, Props } from './types';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Chart from './Chart';

const COLORS_POINTS = [undefined, '#acacac'];

function extractPoints (points: DeriveStakerPoints[] = []): ChartInfo {
  const labels: string[] = [];
  const avgSet: LineDataEntry = [];
  const idxSet: LineDataEntry = [];
  const [total, avgCount] = points.reduce(([total, avgCount], { points }) => {
    if (points.gtn(0)) {
      total += points.toNumber();
      avgCount++;
    }

    return [total, avgCount];
  }, [0, 0]);

  points.forEach(({ era, points }): void => {
    const avg = avgCount > 0
      ? Math.ceil(total * 100 / avgCount) / 100
      : 0;

    labels.push(era.toHuman());
    avgSet.push(avg);
    idxSet.push(points);
  });

  return {
    labels,
    values: [idxSet, avgSet]
  };
}

function ChartPoints ({ validatorId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const params = useMemo(() => [validatorId, false], [validatorId]);
  const stakerPoints = useCall<DeriveStakerPoints[]>(api.derive.staking.stakerPoints, params);
  const [chart, setChart] = useState<ChartInfo>({ labels: [], values: [] });

  useEffect((): void => {
    setChart({ labels: [], values: [] });
  }, [validatorId]);

  useEffect((): void => {
    setChart(extractPoints(stakerPoints));
  }, [stakerPoints]);

  const legendsRef = useRef([
    t<string>('points'),
    t<string>('average')
  ]);

  return (
    <Chart
      chart={chart}
      colors={COLORS_POINTS}
      header={t<string>('era points')}
      legends={legendsRef.current}
      values={chart}
    />
  );
}

export default React.memo(ChartPoints);
