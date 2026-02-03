// Copyright 2017-2026 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AugmentedBlockHeader } from '@polkadot/react-hooks/ctx/types';

import React from 'react';

import { CardSummary, Icon, styled, SummaryBox, Tooltip } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BestFinalized, BestNumber, TimeNow, TotalInactive, TotalIssuance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import useLatency from './Latency/useLatency.js';
import SummarySession from './SummarySession.js';
import { useTranslation } from './translate.js';

interface Props {
  eventCount: number;
  headers: AugmentedBlockHeader[];
}

function Summary ({ eventCount, headers }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();
  const { isLoaded, timeAvg } = useLatency();

  return (
    <SummaryBox>
      <Section>
        {api.query.timestamp && (
          <>
            <CardSummary label={t('last block')}>
              {/* Restart timer on key change */}
              <TimeNow key={headers.at(0)?.hash.toHex()} />
            </CardSummary>
            <CardSummary
              className='media--800 avgBlockTime'
              label={
                <p>
                  {t('average block time')}
                  <Icon
                    icon='info-circle'
                    isPadded
                    tooltip='average-blocktime'
                  />
                  <Tooltip
                    place='top'
                    text={t('Average block time calculated over the last 50 blocks')}
                    trigger='average-blocktime'
                  />
                </p>
              }
            >
              <span className={`--digits ${isLoaded ? '' : '--tmp'}`}>{`${(timeAvg / 1000).toFixed(3)}`}<span className='postfix timeUnit'> s</span></span>
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
      </Section>
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

const Section = styled.section`
  .avgBlockTime span.--digits {
    .postfix {
      font-size: var(--font-percent-tiny);
    }
  }
`;

export default React.memo(Summary);
