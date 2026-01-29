// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakerPoints } from '@polkadot/api-derive/types';
import type { LineData, Props } from './types.js';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import Chart from './Chart.js';

const COLORS_POINTS = [undefined, '#acacac'];

function extractPoints (labels: string[], points: DeriveStakerPoints[]): LineData {
  const avgSet = new Array<number>(labels.length);
  const idxSet = new Array<number>(labels.length);
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
    const index = labels.indexOf(era.toHuman());

    if (index !== -1) {
      avgSet[index] = avg;
      idxSet[index] = points.toNumber();
    }
  });

  return [idxSet, avgSet];
}

function ChartPoints ({ labels, validatorId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const params = useMemo(() => [validatorId, false], [validatorId]);
  const stakerPoints = useCall<DeriveStakerPoints[]>(api.derive.staking.stakerPoints, params);
  const [values, setValues] = useState<LineData>([]);

  useEffect(
    () => setValues([]),
    [validatorId]
  );

  useEffect(
    () => stakerPoints && setValues(extractPoints(labels, stakerPoints)),
    [labels, stakerPoints]
  );

  const legendsRef = useRef([
    t('points'),
    t('average')
  ]);

  return (
    <Chart
      colors={COLORS_POINTS}
      labels={labels}
      legends={legendsRef.current}
      title={t('era points')}
      values={values}
    />
  );
}

export default React.memo(ChartPoints);
