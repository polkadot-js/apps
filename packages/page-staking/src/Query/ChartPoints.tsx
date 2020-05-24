// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveStakerPoints } from '@polkadot/api-derive/types';
import { ChartInfo, LineDataEntry, Props } from './types';

import React, { useEffect, useMemo, useState } from 'react';
import { Chart, Spinner } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

const COLORS_POINTS = [undefined, '#acacac'];

function extractPoints (points: DeriveStakerPoints[]): ChartInfo {
  const labels: string[] = [];
  const avgSet: LineDataEntry = [];
  const idxSet: LineDataEntry = [];
  let avgCount = 0;
  let total = 0;

  points.forEach(({ era, points }): void => {
    total += points.toNumber();
    labels.push(era.toHuman());

    if (points.gtn(0)) {
      avgCount++;
    }

    avgSet.push((avgCount ? Math.ceil(total * 100 / avgCount) : 0) / 100);
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
  const [{ chart, labels }, setChart] = useState<ChartInfo>({ chart: [], labels: [] });
  const stakerPoints = useCall<DeriveStakerPoints[]>(api.derive.staking.stakerPoints, [validatorId, true]);
  const legends = useMemo(() => [
    t<string>('points'),
    t<string>('average')
  ], [t]);

  useEffect((): void => {
    stakerPoints && setChart(
      extractPoints(stakerPoints)
    );
  }, [stakerPoints]);

  return (
    <div className='staking--Chart'>
      <h1>{t<string>('era points')}</h1>
      {chart.length
        ? (
          <Chart.Line
            colors={COLORS_POINTS}
            labels={labels}
            legends={legends}
            values={chart}
          />
        )
        : <Spinner />
      }
    </div>
  );
}

export default React.memo(ChartPoints);
