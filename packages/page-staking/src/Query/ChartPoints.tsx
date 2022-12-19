// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakerPoints } from '@polkadot/api-derive/types';
import type { ChartInfo, LineDataEntry, Props } from './types';

import React, { useMemo, useRef } from 'react';

import { Chart, Spinner } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import { chartOptions } from './util';

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
    chart: [idxSet, avgSet],
    labels
  };
}

function ChartPoints ({ validatorId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const params = useMemo(() => [validatorId, false], [validatorId]);
  const stakerPoints = useCall<DeriveStakerPoints[]>(api.derive.staking.stakerPoints, params);

  const { chart, labels } = useMemo(
    () => extractPoints(stakerPoints),
    [stakerPoints]
  );

  const legendsRef = useRef([
    t<string>('points'),
    t<string>('average')
  ]);

  return (
    <div className='staking--Chart'>
      <h1>{t<string>('era points')}</h1>
      {labels.length
        ? (
          <Chart.Line
            colors={COLORS_POINTS}
            labels={labels}
            legends={legendsRef.current}
            options={chartOptions}
            values={chart}
          />
        )
        : <Spinner />
      }
    </div>
  );
}

export default React.memo(ChartPoints);
