// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LeasePeriod } from '../types.js';

import React from 'react';

import SummarySession from '@polkadot/app-explorer/SummarySession';
import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { BestFinalized } from '@polkadot/react-query';
import { BN_THREE, BN_TWO, formatNumber, isNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';

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
        <CardSummary label={t('parachains')}>
          {isNumber(parachainCount)
            ? formatNumber(parachainCount)
            : <span className='--tmp'>99</span>}
        </CardSummary>
        <CardSummary
          className='media--1000'
          label={t('parathreads')}
        >
          {isNumber(upcomingCount)
            ? formatNumber(upcomingCount)
            : <span className='--tmp'>99</span>}
        </CardSummary>
        {isNumber(proposalCount) && (
          <CardSummary
            className='media--1000'
            label={t('proposals')}
          >
            {formatNumber(proposalCount)}
          </CardSummary>
        )}
      </section>
      <section>
        <CardSummary label={t('current lease')}>
          {leasePeriod
            ? formatNumber(leasePeriod.currentPeriod)
            : <span className='--tmp'>99</span>}
        </CardSummary>
        <CardSummary
          className='media--1200'
          label={t('lease period')}
          progress={{
            isBlurred: !leasePeriod,
            total: leasePeriod ? leasePeriod.length : BN_THREE,
            value: leasePeriod ? leasePeriod.progress : BN_TWO,
            withTime: true
          }}
        />
      </section>
      <section>
        <CardSummary label={t('finalized')}>
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
