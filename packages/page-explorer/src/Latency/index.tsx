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

interface ChartContents {
  labels: string[];
  values: number[][];
}

interface ChartInfo {
  blockLast: number;
  events: ChartContents;
  extrinsics: ChartContents;
  times: ChartContents;
}

const COLORS_TIMES = ['#8c2200', '#acacac'];
// const COLORS_EVENTS = ['#008c22', '#acacac'];
// const COLORS_TXS = ['#00228c', '#acacac'];
const OPTIONS = {
  animation: {
    duration: 0
  },
  aspectRatio: 5,
  maintainAspectRatio: true
};

function getPoints (details: Detail[], timeAvg: number): ChartInfo {
  const events: ChartContents = {
    labels: [],
    values: [[], []]
  };
  const extrinsics: ChartContents = {
    labels: [],
    values: [[], []]
  };
  const times: ChartContents = {
    labels: [],
    values: [[], []]
  };

  const eventAvg = details.reduce((a, { countEvents }) => a + countEvents, 0);
  const txAvg = details.reduce((a, { countExtrinsics }) => a + countExtrinsics, 0);

  for (let i = 0; i < details.length; i++) {
    events.labels.push(formatNumber(details[i].blockNumber));
    events.values[0].push(details[i].countEvents);
    events.values[1].push((eventAvg - details[i].countEvents) / (details.length - 1));

    extrinsics.labels.push(formatNumber(details[i].blockNumber));
    extrinsics.values[0].push(details[i].countExtrinsics);
    extrinsics.values[1].push((txAvg - details[i].countExtrinsics) / (details.length - 1));
  }

  const filtered = details.filter(({ delay }) => delay);
  const avgBase = timeAvg * filtered.length;

  for (let i = 0; i < filtered.length; i++) {
    times.labels.push(formatNumber(filtered[i].blockNumber));
    times.values[0].push(filtered[i].delay / 1000);
    times.values[1].push((avgBase - filtered[i].delay) / (filtered.length - 1) / 1000);
  }

  return {
    blockLast: times.values[0][times.values[0].length - 1],
    events,
    extrinsics,
    times
  };
}

function formatTime (time: number, divisor = 1000): string {
  return `${(time / divisor).toFixed(3)}s`;
}

function Latency ({ className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { details, stdDev, timeAvg, timeMax, timeMin } = useLatency();

  const { blockLast, /* events, extrinsics, */ times } = useMemo(
    () => getPoints(details, timeAvg),
    [details, timeAvg]
  );

  const { /* eventsLegend, extrinsicsLegend, */ timesLegend } = useMemo(
    () => ({
      eventsLegend: [t<string>('events'), t<string>('average')],
      extrinsicsLegend: [t<string>('extrinsics'), t<string>('average')],
      timesLegend: [t<string>('blocktime'), t<string>('average')]
    }), [t]
  );

  if (details.length <= 2) {
    return (
      <Spinner />
    );
  }

  return (
    <div className={className}>
      <SummaryBox>
        <section>
          <CardSummary label={t<string>('avg')}>{formatTime(timeAvg)}</CardSummary>
          <CardSummary
            className='media--1000'
            label={t<string>('std dev')}
          >
            {formatTime(stdDev)}
          </CardSummary>
        </section>
        <section>
          <CardSummary label={t<string>('min')}>{formatTime(timeMin)}</CardSummary>
          <CardSummary label={t<string>('max')}>{formatTime(timeMax)}</CardSummary>
        </section>
        <CardSummary label={t<string>('last')}>{formatTime(blockLast, 1)}</CardSummary>
      </SummaryBox>
      <div className='container'>
        <h1>{t<string>('blocktimes (last {{num}} blocks)', { replace: { num: times.labels.length } })}</h1>
        <Chart.Line
          colors={COLORS_TIMES}
          labels={times.labels}
          legends={timesLegend}
          options={OPTIONS}
          values={times.values}
        />
      </div>
      {/* <div className='container'>
        <h1>{t<string>('events (last {{num}} blocks)', { replace: { num: events.labels.length } })}</h1>
        <Chart.Line
          colors={COLORS_EVENTS}
          labels={events.labels}
          legends={eventsLegend}
          options={OPTIONS}
          values={events.values}
        />
      </div>
      <div className='container'>
        <h1>{t<string>('extrinsics (last {{num}} blocks)', { replace: { num: extrinsics.labels.length } })}</h1>
        <Chart.Line
          colors={COLORS_TXS}
          labels={extrinsics.labels}
          legends={extrinsicsLegend}
          options={OPTIONS}
          values={extrinsics.values}
        />
      </div> */}
    </div>
  );
}

export default React.memo(styled(Latency)`
  .container {
    background: var(--bg-table);
    border: 1px solid var(--border-table);
    border-radius: 0.25rem;
    padding: 1rem 1.5rem;
  }

  .container+.container {
    margin-top: 1rem;
  }
`);
