// Copyright 2017-2023 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiStats } from '@polkadot/react-hooks/ctx/types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { CardSummary, Spinner, SummaryBox } from '@polkadot/react-components';
import { useApiStats } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import Chart from '../Latency/Chart';
import { useTranslation } from '../translate';

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
      bytesLegend: [t<string>('sent'), t<string>('recv'), t<string>('average')],
      errorsLegend: [t<string>('errors')],
      requestsLegend: [t<string>('total'), t<string>('requests'), t<string>('subscriptions'), t<string>('average')]
    }), [t]
  );

  const { bytesChart, requestsChart } = useMemo(
    () => getPoints(stats),
    [stats]
  );

  if (stats.length <= 3) {
    return <Spinner />;
  }

  const { stats: { total: { bytesRecv, bytesSent, requests: tReq, subscriptions: tSub } } } = stats[stats.length - 1];

  return (
    <StyledDiv className={className}>
      <SummaryBox>
        <section>
          <CardSummary label={t<string>('sent')}>{formatNumber(bytesSent / 1024)}kB</CardSummary>
          <CardSummary label={t<string>('recv')}>{formatNumber(bytesRecv / 1024)}kB</CardSummary>
        </section>
        <section>
          <CardSummary label={t<string>('total req')}>{formatNumber(tReq)}</CardSummary>
          <CardSummary label={t<string>('total sub')}>{formatNumber(tSub)}</CardSummary>
        </section>
      </SummaryBox>
      <Chart
        colors={COLORS_REQUESTS}
        legends={requestsLegend}
        title={t<string>('requests')}
        value={requestsChart}
      />
      <Chart
        colors={COLORS_BYTES}
        legends={bytesLegend}
        title={t<string>('transfer')}
        value={bytesChart}
      />
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
