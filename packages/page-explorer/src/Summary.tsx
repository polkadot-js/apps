// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AugmentedBlockHeader } from '@polkadot/react-hooks/ctx/types';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BestFinalized, BestNumber, BlockToTime, TimeNow, TotalInactive, TotalIssuance } from '@polkadot/react-query';
import { BN_ONE, formatNumber } from '@polkadot/util';

import SummarySession from './SummarySession.js';
import { useTranslation } from './translate.js';

interface Props {
  eventCount: number;
  headers: AugmentedBlockHeader[];
}

function Summary ({ eventCount, headers }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();

  return (
    <SummaryBox>
      <section>
        {api.query.timestamp && (
          <>
            <CardSummary label={t('last block')}>
              {/* Restart timer on key change */}
              <TimeNow key={headers.at(0)?.hash.toHex()} />
            </CardSummary>
            <CardSummary
              className='media--800'
              label={t('slot')}
            >
              <BlockToTime value={BN_ONE} />
            </CardSummary>
          </>
        )}
        {api.query.balances && (
          <>
            <CardSummary
              className='media--800'
              label={t('total issuance')}
            >
              <TotalIssuance />
            </CardSummary>
            {!!api.query.balances.inactiveIssuance && (
              <CardSummary
                className='media--1300'
                label={t('inactive issuance')}
              >
                <TotalInactive />
              </CardSummary>
            )}
          </>
        )}
      </section>
      <section className='media--1100'>
        <SummarySession withEra={false} />
      </section>
      <section>
        <CardSummary
          className='media--1400'
          label={t('last events')}
        >
          {formatNumber(eventCount)}
        </CardSummary>
        {api.query.grandpa && (
          <CardSummary label={t('finalized')}>
            <BestFinalized />
          </CardSummary>
        )}
        <CardSummary label={t('best')}>
          <BestNumber />
        </CardSummary>
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
