// Copyright 2017-2022 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BestFinalized, BestNumber, BlockToTime, TimeNow, TotalInactive, TotalIssuance } from '@polkadot/react-query';
import { BN_ONE, formatNumber } from '@polkadot/util';

import SummarySession from './SummarySession';
import { useTranslation } from './translate';

interface Props {
  eventCount: number;
}

function Summary ({ eventCount }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();

  return (
    <SummaryBox>
      <section>
        {api.query.timestamp && (
          <>
            <CardSummary label={t<string>('last block')}>
              <TimeNow />
            </CardSummary>
            <CardSummary
              className='media--800'
              label={t<string>('target')}
            >
              <BlockToTime value={BN_ONE} />
            </CardSummary>
          </>
        )}
        {api.query.balances && (
          <>
            <CardSummary
              className='media--800'
              label={t<string>('total issuance')}
            >
              <TotalIssuance />
            </CardSummary>
            <CardSummary
              className='media--1300'
              label={t<string>('inactive issuance')}
            >
              <TotalInactive />
            </CardSummary>
          </>
        )}
      </section>
      <section className='media--1100'>
        <SummarySession withEra={false} />
      </section>
      <section>
        <CardSummary
          className='media--1400'
          label={t<string>('last events')}
        >
          {formatNumber(eventCount)}
        </CardSummary>
        {api.query.grandpa && (
          <CardSummary label={t<string>('finalized')}>
            <BestFinalized />
          </CardSummary>
        )}
        <CardSummary label={t<string>('best')}>
          <BestNumber />
        </CardSummary>
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
