// Copyright 2017-2023 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChartContents, Detail } from './types';

import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { CardSummary, Spinner, SummaryBox } from '@polkadot/react-components';
import { formatNumber, nextTick } from '@polkadot/util';

import { useTranslation } from '../translate';
import Chart from './Chart';
import useLatency from './useLatency';

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

const COLORS_TIMES = ['#8c8c00', '#acacac'];
const COLORS_BLOCKS = ['#008c8c', '#acacac'];
const COLORS_EVENTS = ['#00448c', '#8c0044', '#acacac'];
const COLORS_TXS = ['#448c00', '#acacac'];

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

function formatTime (time: number, divisor = 1000): React.ReactNode {
  return <span className='--digits'>{`${(time / divisor).toFixed(3)}`}<span className='postfix'> s</span></span>;
}

function Latency ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { details, maxItems, stdDev, timeAvg, timeMax, timeMin } = useLatency();
  const [renderOrder, setRenderOrder] = useState([false, false, false, false]);

  const isLoaded = useMemo(
    () => details.length === maxItems,
    [details, maxItems]
  );

  useEffect((): void => {
    // HACK try and render the charts in order - this _may_ work around the
    // crosshair plugin init issues, but at beast it is most non-reproducable
    if (isLoaded) {
      const index = renderOrder.findIndex((v) => !v);

      if (index !== -1) {
        nextTick(() =>
          setRenderOrder((prev) => {
            const result = new Array<boolean>(prev.length);

            for (let i = 0; i < result.length; i++) {
              result[i] = (i === index) || prev[i];
            }

            return result;
          })
        );
      }
    }
  }, [isLoaded, renderOrder]);

  const points = useMemo(
    () => getPoints(details, timeAvg),
    [details, timeAvg]
  );

  const [legend, title] = useMemo(
    () => [
      {
        blocks: [t<string>('bytes'), t<string>('average')],
        events: [t<string>('events'), t<string>('system'), t<string>('average')],
        extrinsics: [t<string>('extrinsics'), t<string>('average')],
        times: [t<string>('blocktime'), t<string>('average')]
      },
      {
        blocks: t<string>('blocksize (last {{n}} blocks)', { replace: { n: maxItems } }),
        events: t<string>('events (last {{n}} blocks)', { replace: { n: maxItems } }),
        extrinsics: t<string>('extrinsics (last {{n}} blocks)', { replace: { n: maxItems } }),
        times: t<string>('blocktimes (last {{n}} blocks)', { replace: { n: maxItems } })
      }
    ],
    [maxItems, t]
  );

  const EMPTY_TIME = <span className='--tmp --digits'>0.000 <span className='postfix'>s</span></span>;

  return (
    <div className={className}>
      <SummaryBox>
        <section>
          <CardSummary label={t<string>('avg')}>
            {isLoaded
              ? formatTime(timeAvg)
              : EMPTY_TIME}
          </CardSummary>
          <CardSummary
            className='media--1000'
            label={t<string>('std dev')}
          >
            {isLoaded
              ? formatTime(stdDev)
              : EMPTY_TIME}
          </CardSummary>
        </section>
        <section>
          <CardSummary label={t<string>('min')}>
            {isLoaded
              ? formatTime(timeMin)
              : EMPTY_TIME}
          </CardSummary>
          <CardSummary label={t<string>('max')}>
            {isLoaded
              ? formatTime(timeMax)
              : EMPTY_TIME
            }
          </CardSummary>
        </section>
        <CardSummary label={t<string>('last')}>
          {isLoaded
            ? formatTime(points.blockLast, 1)
            : EMPTY_TIME}
        </CardSummary>
      </SummaryBox>
      {isLoaded
        ? (
          <div key='charts'>
            {renderOrder[0] && (
              <Chart
                colors={COLORS_TIMES}
                key='times'
                legends={legend.times}
                title={title.times}
                value={points.times}
              />
            )}
            {renderOrder[1] && (
              <Chart
                colors={COLORS_BLOCKS}
                key='blocks'
                legends={legend.blocks}
                title={title.blocks}
                value={points.blocks}
              />
            )}
            {renderOrder[2] && (
              <Chart
                colors={COLORS_TXS}
                key='extrinsics'
                legends={legend.extrinsics}
                title={title.extrinsics}
                value={points.extrinsics}
              />
            )}
            {renderOrder[3] && (
              <Chart
                colors={COLORS_EVENTS}
                key='events'
                legends={legend.events}
                title={title.events}
                value={points.events}
              />
            )}
          </div>
        )
        : <Spinner />
      }
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

  span.--digits {
    .postfix {
      font-size: var(--font-percent-tiny);
    }
  }
`);
