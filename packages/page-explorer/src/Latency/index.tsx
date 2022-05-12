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
  blocks: ChartContents;
  events: ChartContents;
  extrinsics: ChartContents;
  times: ChartContents;
}

const COLORS_TIMES = ['#8c8c00', '#acacac'];
const COLORS_BLOCKS = ['#008c8c', '#acacac'];
const COLORS_EVENTS = ['#00448c', '#8c0044', '#acacac'];
const COLORS_TXS = ['#448c00', '#acacac'];
const OPTIONS = {
  animation: {
    duration: 0
  },
  aspectRatio: 6,
  maintainAspectRatio: true
};

function getPoints (details: Detail[], timeAvg: number): ChartInfo {
  const blocks: ChartContents = {
    labels: [],
    values: [[], []]
  };
  const events: ChartContents = {
    labels: [],
    values: [[], [], []]
  };
  const extrinsics: ChartContents = {
    labels: [],
    values: [[], []]
  };
  const times: ChartContents = {
    labels: [],
    values: [[], []]
  };

  const eventTotal = details.reduce((a, { events: { count } }) => a + count, 0);
  const txTotal = details.reduce((a, { extrinsics: { count } }) => a + count, 0);
  const blockTotal = details.reduce((a, { block: { bytes } }) => a + bytes, 0);

  for (let i = 0; i < details.length; i++) {
    const blockNumber = formatNumber(details[i].block.number);

    blocks.labels.push(blockNumber);
    blocks.values[0].push(details[i].block.bytes);
    blocks.values[1].push(blockTotal / details.length);

    events.labels.push(blockNumber);
    events.values[0].push(details[i].events.count);
    events.values[1].push(details[i].events.system);
    events.values[2].push(eventTotal / details.length);

    extrinsics.labels.push(blockNumber);
    extrinsics.values[0].push(details[i].extrinsics.count);
    extrinsics.values[1].push(txTotal / details.length);
  }

  const filtered = details.filter(({ delay }) => delay);
  const avgBase = timeAvg * filtered.length;

  for (let i = 0; i < filtered.length; i++) {
    times.labels.push(formatNumber(filtered[i].block.number));
    times.values[0].push(filtered[i].delay / 1000);
    times.values[1].push(avgBase / filtered.length / 1000);
  }

  return {
    blockLast: times.values[0][times.values[0].length - 1],
    blocks,
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

  const { blockLast, blocks, events, extrinsics, times } = useMemo(
    () => getPoints(details, timeAvg),
    [details, timeAvg]
  );

  const { blocksLegend, eventsLegend, extrinsicsLegend, timesLegend } = useMemo(
    () => ({
      blocksLegend: [t<string>('bytes'), t<string>('average')],
      eventsLegend: [t<string>('events'), t<string>('system'), t<string>('average')],
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
      <div className='container'>
        <h1>{t<string>('blocksize (last {{num}} blocks)', { replace: { num: blocks.labels.length } })}</h1>
        <Chart.Line
          colors={COLORS_BLOCKS}
          labels={blocks.labels}
          legends={blocksLegend}
          options={OPTIONS}
          values={blocks.values}
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
      </div>
      <div className='container'>
        <h1>{t<string>('events (last {{num}} blocks)', { replace: { num: events.labels.length } })}</h1>
        <Chart.Line
          colors={COLORS_EVENTS}
          labels={events.labels}
          legends={eventsLegend}
          options={OPTIONS}
          values={events.values}
        />
      </div>
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
