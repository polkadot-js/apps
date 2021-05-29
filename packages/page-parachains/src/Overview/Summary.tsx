// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LeasePeriod } from '../types';

import React from 'react';

import SummarySession from '@polkadot/app-explorer/SummarySession';
import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { formatNumber, isNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  leasePeriod?: LeasePeriod;
  parachainCount?: number;
  proposalCount?: number;
  upcomingCount?: number;
}

function Summary ({ leasePeriod, parachainCount, proposalCount, upcomingCount }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <SummaryBox>
      <section>
        {isNumber(parachainCount) && (
          <CardSummary label={t<string>('parachains')}>
            {formatNumber(parachainCount)}
          </CardSummary>
        )}
        {isNumber(upcomingCount) && (
          <CardSummary label={t<string>('parathreads')}>
            {formatNumber(upcomingCount)}
          </CardSummary>
        )}
        {isNumber(proposalCount) && (
          <CardSummary label={t<string>('proposals')}>
            {formatNumber(proposalCount)}
          </CardSummary>
        )}
      </section>
      <section>
        {leasePeriod && (
          <CardSummary label={t<string>('current lease')}>
            {formatNumber(leasePeriod.currentPeriod)}
          </CardSummary>
        )}
      </section>
      <section>
        {leasePeriod && (
          <CardSummary
            label={t<string>('lease period')}
            progress={{
              total: leasePeriod.length,
              value: leasePeriod.progress,
              withTime: true
            }}
          />
        )}
        <SummarySession
          className='media--800'
          withEra={false}
        />
      </section>
    </SummaryBox>
  );
}

export default Summary;
