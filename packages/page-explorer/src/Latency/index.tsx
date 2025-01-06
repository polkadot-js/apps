// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChartContents, Detail } from './types.js';

import React, { useEffect, useMemo, useState } from 'react';

import { CardSummary, NextTick, styled, SummaryBox } from '@polkadot/react-components';
import { formatNumber, nextTick } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import Chart from './Chart.js';
import useLatency from './useLatency.js';

interface Props {
  className?: string;
}

interface ChartInfo {
  blockLast: number;
  blocks: ChartContents;
  events: ChartContents;
  extrinsics: ChartContents;
  times: ChartContents;
}

const ORDER = ['times', 'blocks', 'extrinsics', 'events'] as const;

const COLORS = {
  blocks: ['#008c8c', '#acacac'],
  events: ['#00448c', '#8c0044', '#acacac'],
  extrinsics: ['#448c00', '#acacac'],
  times: ['#8c8c00', '#acacac']
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

  for (let i = 0, count = details.length; i < count; i++) {
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

  for (let i = 0, count = filtered.length; i < count; i++) {
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

function formatTime (time: number, divisor = 1000): React.ReactNode {
  return <span className='--digits'>{`${(time / divisor).toFixed(3)}`}<span className='postfix'> s</span></span>;
}

function Latency ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { details, isLoaded, maxItems, stdDev, timeAvg, timeMax, timeMin } = useLatency();
  const [shouldRender, setShouldRender] = useState(() => new Array<boolean>(ORDER.length).fill(false));

  useEffect((): void => {
    // HACK try and render the charts in order - this _may_ work around the
    // crosshair plugin init issues, but at best it is non-reproducible
    if (isLoaded) {
      const index = shouldRender.findIndex((v) => !v);

      if (index !== -1) {
        nextTick(() =>
          setShouldRender(
            shouldRender.map((v, i) => (i === index) || v)
          )
        );
      }
    }
  }, [isLoaded, shouldRender]);

  const points = useMemo(
    () => getPoints(details, timeAvg),
    [details, timeAvg]
  );

  const [legend, title] = useMemo(
    () => [
      {
        blocks: [t('bytes'), t('average')],
        events: [t('events'), t('system'), t('average')],
        extrinsics: [t('extrinsics'), t('average')],
        times: [t('blocktime'), t('average')]
      },
      {
        blocks: t('blocksize (last {{n}} blocks)', { replace: { n: maxItems } }),
        events: t('events (last {{n}} blocks)', { replace: { n: maxItems } }),
        extrinsics: t('extrinsics (last {{n}} blocks)', { replace: { n: maxItems } }),
        times: t('blocktimes (last {{n}} blocks)', { replace: { n: maxItems } })
      }
    ],
    [maxItems, t]
  );

  const EMPTY_TIME = <span className='--tmp --digits'>0.000 <span className='postfix'>s</span></span>;

  return (
    <StyledDiv className={className}>
      <SummaryBox>
        <section>
          <CardSummary label={t('avg')}>
            {isLoaded
              ? formatTime(timeAvg)
              : EMPTY_TIME}
          </CardSummary>
          <CardSummary
            className='media--1000'
            label={t('std dev')}
          >
            {isLoaded
              ? formatTime(stdDev)
              : EMPTY_TIME}
          </CardSummary>
        </section>
        <section>
          <CardSummary label={t('min')}>
            {isLoaded
              ? formatTime(timeMin)
              : EMPTY_TIME}
          </CardSummary>
          <CardSummary label={t('max')}>
            {isLoaded
              ? formatTime(timeMax)
              : EMPTY_TIME
            }
          </CardSummary>
        </section>
        <CardSummary label={t('last')}>
          {isLoaded
            ? formatTime(points.blockLast, 1)
            : EMPTY_TIME}
        </CardSummary>
      </SummaryBox>
      <NextTick isActive={isLoaded}>
        {ORDER.map((key) => (
          <Chart
            colors={COLORS[key]}
            key={key}
            legends={legend[key]}
            title={title[key]}
            value={points[key]}
          />
        ))}
      </NextTick>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  .container {
    background: var(--bg-table);
    border: 1px solid var(--border-table);
    border-radius: 0.25rem;
    padding: 1rem 1.5rem;
  }

  .container+.container {
    margin-top: 1rem;
  }

  span.--digits {
    .postfix {
      font-size: var(--font-percent-tiny);
    }
  }
`;

export default React.memo(Latency);
