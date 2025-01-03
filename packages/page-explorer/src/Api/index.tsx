// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChartOptions } from 'chart.js';
import type { ApiStats } from '@polkadot/react-hooks/ctx/types';

import React, { useMemo } from 'react';

import { CardSummary, NextTick, styled, SummaryBox } from '@polkadot/react-components';
import { useApiStats } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import Chart from '../Latency/Chart.js';
import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
}

interface ChartContents {
  labels: string[];
  values: number[][];
}

interface ChartInfo {
  bytesChart: ChartContents;
  errorsChart: ChartContents;
  requestsChart: ChartContents;
}

const OPTIONS: ChartOptions = {
  aspectRatio: 6,
  maintainAspectRatio: true,
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

// const COLORS_ERRORS = ['#8c0044', '#acacac'];

const COLORS_BYTES = ['#00448c', '#008c44', '#acacac'];
const COLORS_REQUESTS = ['#008c8c', '#00448c', '#8c4400', '#acacac'];

function getPoints (all: ApiStats[]): ChartInfo {
  const bytesChart: ChartContents = {
    labels: [],
    values: [[], [], []]
  };
  const errorsChart: ChartContents = {
    labels: [],
    values: [[]]
  };
  const requestsChart: ChartContents = {
    labels: [],
    values: [[], [], [], []]
  };

  const reqBase = all.reduce((a, { stats: { active: { requests, subscriptions } } }) => a + requests + subscriptions, 0);
  let { bytesRecv: prevRecv, bytesSent: prevSent, errors: prevErrors } = all[0].stats.total;
  let recvTotal = 0;

  for (let i = 1; i < all.length; i++) {
    const { stats: { active: { requests: aReq, subscriptions: aSub }, total: { bytesRecv, bytesSent, errors } }, when } = all[i];
    const time = new Date(when).toLocaleTimeString();

    bytesChart.labels.push(time);
    bytesChart.values[0].push(bytesSent - prevSent);
    bytesChart.values[1].push(bytesRecv - prevRecv);

    errorsChart.labels.push(time);
    errorsChart.values[0].push(errors - prevErrors);

    requestsChart.labels.push(time);
    requestsChart.values[0].push(aReq + aSub);
    requestsChart.values[1].push(aReq);
    requestsChart.values[2].push(aSub);
    requestsChart.values[3].push(reqBase / all.length);

    recvTotal += bytesRecv - prevRecv;
    prevErrors = errors;
    prevRecv = bytesRecv;
    prevSent = bytesSent;
  }

  const recvAvg = recvTotal / (all.length - 1);

  for (let i = 1; i < all.length; i++) {
    bytesChart.values[2].push(recvAvg);
  }

  return { bytesChart, errorsChart, requestsChart };
}

function Api ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const stats = useApiStats();

  const { bytesLegend, requestsLegend } = useMemo(
    () => ({
      bytesLegend: [t('sent'), t('recv'), t('average')],
      errorsLegend: [t('errors')],
      requestsLegend: [t('total'), t('requests'), t('subscriptions'), t('average')]
    }), [t]
  );

  const { bytesChart, requestsChart } = useMemo(
    () => getPoints(stats),
    [stats]
  );

  const last = stats[stats.length - 1];
  const isLoaded = last && (stats.length > 3);
  const EMPTY_NUMBER = <span className='--tmp'>99</span>;
  const EMPTY_BYTES = <span className='--tmp'>1,000kB</span>;

  return (
    <StyledDiv className={className}>
      <SummaryBox>
        <section>
          <CardSummary label={t('sent')}>
            {isLoaded
              ? <>{formatNumber(last.stats.total.bytesSent / 1024)}kB</>
              : EMPTY_BYTES}
          </CardSummary>
          <CardSummary label={t('recv')}>
            {isLoaded
              ? <>{formatNumber(last.stats.total.bytesRecv / 1024)}kB</>
              : EMPTY_BYTES}
          </CardSummary>
        </section>
        <section>
          <CardSummary label={t('total req')}>
            {isLoaded
              ? <>{formatNumber(last.stats.total.requests)}</>
              : EMPTY_NUMBER}
          </CardSummary>
          <CardSummary label={t('total sub')}>
            {isLoaded
              ? <>{formatNumber(last.stats.total.subscriptions)}</>
              : EMPTY_NUMBER}
          </CardSummary>
        </section>
      </SummaryBox>
      <NextTick isActive={isLoaded}>
        <Chart
          colors={COLORS_REQUESTS}
          legends={requestsLegend}
          options={OPTIONS}
          title={t('requests made')}
          value={requestsChart}
        />
        <Chart
          colors={COLORS_BYTES}
          legends={bytesLegend}
          options={OPTIONS}
          title={t('bytes transferred')}
          value={bytesChart}
        />
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
`;

export default React.memo(Api);
