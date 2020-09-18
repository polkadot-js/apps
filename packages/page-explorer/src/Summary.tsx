// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useApi } from '@polkadot/react-hooks';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { BestFinalized, BestNumber, BlockToTime, TimeNow, TotalIssuance } from '@polkadot/react-query';
import { BN_ONE } from '@polkadot/util';

import SummarySession from './SummarySession';
import { useTranslation } from './translate';

function Summary (): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();

  return (
    <SummaryBox>
      <section>
        <CardSummary label={t<string>('last block')}>
          <TimeNow />
        </CardSummary>
        <CardSummary
          className='media--800'
          label={t<string>('target')}
        >
          <BlockToTime blocks={BN_ONE} />
        </CardSummary>
        {api.query.balances && (
          <CardSummary
            className='media--800'
            label={t<string>('total issuance')}
          >
            <TotalIssuance />
          </CardSummary>
        )}
      </section>
      <section className='media--1200'>
        <SummarySession withEra={false} />
      </section>
      <section>
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
