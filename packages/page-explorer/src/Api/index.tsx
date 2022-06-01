// Copyright 2017-2022 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Stats } from '@polkadot/react-components/ApiStats/types';

import React, { useContext, useMemo } from 'react';
import styled from 'styled-components';

import { ApiStatsContext, CardSummary, Chart, Spinner, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
}

interface ChartContents {
  labels: string[];
  values: number[][];
}

interface ChartInfo {
  requests: ChartContents;
}

const COLORS_REQUESTS = ['#008c8c', '#00448c', '#8c0044', '#acacac'];
const OPTIONS = {
  animation: {
    duration: 0
  },
  aspectRatio: 6,
  maintainAspectRatio: true
};

function getPoints (all: Stats[]): ChartInfo {
  const requests: ChartContents = {
    labels: [],
    values: [[], [], [], []]
  };

  const reqBase = all.reduce((a, { stats: { active: { requests, subscriptions } } }) => a + requests + subscriptions, 0);

  for (let i = 0; i < all.length; i++) {
    const { stats: { active: { requests: aReq, subscriptions: aSub } }, when } = all[i];

    const time = new Date(when).toLocaleTimeString();

    requests.labels.push(time);
    requests.values[0].push(aReq + aSub);
    requests.values[1].push(aReq);
    requests.values[2].push(aSub);
    requests.values[3].push(reqBase / all.length);
  }

  return { requests };
}

function Api ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const stats = useContext(ApiStatsContext);

  const { requestsLegend } = useMemo(
    () => ({
      requestsLegend: [t<string>('total'), t<string>('requests'), t<string>('subscriptions'), t<string>('average')]
    }), [t]
  );

  const { requests } = useMemo(
    () => getPoints(stats),
    [stats]
  );

  if (stats.length <= 2) {
    return <Spinner />;
  }

  const { stats: { total: { bytesRecv, bytesSent, requests: tReq, subscriptions: tSub } } } = stats[stats.length - 1];

  return (
    <div className={className}>
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
      <div className='container'>
        <h1>{t<string>('requests & subscriptions')}</h1>
        <Chart.Line
          colors={COLORS_REQUESTS}
          labels={requests.labels}
          legends={requestsLegend}
          options={OPTIONS}
          values={requests.values}
        />
      </div>
    </div>
  );
}

export default React.memo(styled(Api)`
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
