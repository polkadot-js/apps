// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LeasePeriod } from '../types';

import React from 'react';

import SummarySession from '@polkadot/app-explorer/SummarySession';
import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { BestFinalized } from '@polkadot/react-query';
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
          <CardSummary
            className='media--1000'
            label={t<string>('parathreads')}
          >
            {formatNumber(upcomingCount)}
          </CardSummary>
        )}
        {isNumber(proposalCount) && (
          <CardSummary
            className='media--1000'
            label={t<string>('proposals')}
          >
            {formatNumber(proposalCount)}
          </CardSummary>
        )}
      </section>
      <section>
        {leasePeriod && (
          <>
            <CardSummary label={t<string>('current lease')}>
              {formatNumber(leasePeriod.currentPeriod)}
            </CardSummary>
            <CardSummary
              className='media--1200'
              label={t<string>('lease period')}
              progress={{
                total: leasePeriod.length,
                value: leasePeriod.progress,
                withTime: true
              }}
            />
          </>
        )}
      </section>
      <section>
        <CardSummary label={t<string>('finalized')}>
          <BestFinalized />
        </CardSummary>
        <SummarySession
          className='media--1200'
          withEra={false}
        />
      </section>
    </SummaryBox>
  );
}

export default Summary;
