// Copyright 2017-2022 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Detail } from './types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { CardSummary, Chart, Spinner, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import useLatency from './useLatency';

interface Props {
  className?: string;
}

interface ChartInfo {
  labels: string[];
  values: number[][];
}

const COLORS = ['#8c2200'];
const LEGENDS: string[] = [];
const OPTIONS = {
  animation: {
    duration: 0
  },
  aspectRatio: 4,
  maintainAspectRatio: true
};

function getPoints (details: Detail[]): ChartInfo {
  const labels = new Array<string>(details.length);
  const times = new Array<number>(details.length);

  for (let i = 0; i < details.length; i++) {
    labels[i] = formatNumber(details[i].blockNumber);
    times[i] = details[i].delay / 1000;
  }

  return { labels, values: [times] };
}

function Latency ({ className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { details, timeAvg, timeMax, timeMin } = useLatency();

  const { labels, values } = useMemo(
    () => getPoints(details),
    [details]
  );

  if (details.length <= 2) {
    return (
      <Spinner />
    );
  }

  return (
    <div className={className}>
      <SummaryBox>
        <CardSummary label={t<string>('min')}>{(timeMin / 1000).toFixed(3)}s</CardSummary>
        <CardSummary label={t<string>('avg')}>{(timeAvg / 1000).toFixed(3)}s</CardSummary>
        <CardSummary label={t<string>('max')}>{(timeMax / 1000).toFixed(3)}s</CardSummary>
        <CardSummary label={t<string>('last')}>{values[values.length - 1][0].toFixed(3)}s</CardSummary>
      </SummaryBox>
      <div className='container'>
        <h1>{t<string>('blocktimes (last {{num}} blocks)', { replace: { num: labels.length } })}</h1>
        <Chart.Line
          colors={COLORS}
          labels={labels}
          legends={LEGENDS}
          options={OPTIONS}
          values={values}
        />
      </div>
    </div>
  );
}

export default styled(Latency)`
  .container {
    background: var(--bg-table);
    border: 1px solid var(--border-table);
    border-radius: 0.25rem;
    padding: 1rem 1.5rem;
  }
`;
