// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ReactNode } from 'react';
import type { ApiPromise } from '@polkadot/api';
import type { IAhOutput } from './index.js';

import React from 'react';
import { Link } from 'react-router-dom';

import { CardSummary, Expander, MarkWarning, Spinner, styled } from '@polkadot/react-components';
import { Event as EventDisplay } from '@polkadot/react-params';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  children: ReactNode;
  ahApi?: ApiPromise;
  ahOutput: IAhOutput[];
  ahUrl: string;
  isRelayChain: boolean
}

function AssetHubSection ({ ahApi, ahOutput, ahUrl, children, isRelayChain }: Props) {
  const { t } = useTranslation();

  return (
    <div>
      <h1
        style={{
          alignItems: 'center',
          display: 'flex',
          textTransform: 'capitalize'
        }}
      >
        {t('Asset Hub chain')}
        {children}
      </h1>
      {!ahApi && <Spinner label='Connecting to Asset Hub' />}
      <StyledSection>
        {ahOutput.map((ah) => {
          return (
            <div
              className='assethub__chain'
              key={ah.finalizedBlock}
            >
              <div className='details'>
                <div className='session__summary'>
                  <h4 className='--digits'>
                    {!isRelayChain
                      ? <Link to={`/explorer/query/${ah.finalizedBlock}`}>#{formatNumber(ah.finalizedBlock)}</Link>
                      : (
                        <Link
                          target='_blank'
                          to={`${window.location.origin}/?rpc=${ahUrl}#/explorer/query/${ah.finalizedBlock}`}
                        >
                          #{formatNumber(ah.finalizedBlock)}
                        </Link>)
                    }

                  </h4>
                </div>
                <div>
                  <div className='staking__summary'>
                    <CardSummary label={t('current era')}>
                      {ah.staking.currentEra}
                    </CardSummary>
                    <CardSummary label={t('era session index')}>
                      {ah.staking.erasStartSessionIndex}
                    </CardSummary>
                    <CardSummary label={t('active era')}>
                      {ah.staking.activeEra.index}
                    </CardSummary>
                  </div>
                  <div className='multiblock__summary'>
                    <CardSummary label={t('multiblock phase')}>
                      {ah.multiblock.phase}
                    </CardSummary>
                    {ah.multiblock.queuedScore &&
                    <CardSummary label={t('multiblock queued score')}>
                      {ah.multiblock.queuedScore}
                    </CardSummary>}
                    <CardSummary label={t('signed submissions')}>
                      {ah.multiblock.signedSubmissions}
                    </CardSummary>
                    {!!ah.multiblock.snapshotRange.length &&
                    <CardSummary label={t('snapshot range')}>
                      {ah.multiblock.snapshotRange}
                    </CardSummary>}
                  </div>
                  <div className='rcClient__summary'>
                    <CardSummary label={t('Last Session Report End Index')}>
                      {ah.rcClient.lastSessionReportEndIndex}
                    </CardSummary>
                  </div>
                </div>
              </div>
              <div className='events__summary'>
                <h3>{t('events')}</h3>
                {ah.events.map((event) => {
                  const eventName = `${event.section}.${event.method}`;

                  return (
                    <Expander
                      isLeft
                      key={event.index.toString()}
                      summary={eventName}
                      summaryMeta={event.meta}
                    >
                      <EventDisplay
                        className='details'
                        eventName={eventName}
                        value={event}
                        withExpander
                      />
                    </Expander>

                  );
                })}
                {ah.events.length === 0 && <MarkWarning content={t('No events available')} />}
              </div>
            </div>
          );
        })}
      </StyledSection>
    </div>);
}

const StyledSection = styled.section`
  margin-block: 1rem;
  overflow: auto;
  white-space: nowrap;

  .warning {
    max-width: fit-content;
    margin-left: 0;
  }

  .ui--Labelled-content {
    font-size: var(--font-size-h3);
    font-weight: var(--font-weight-normal);
  }

  .assethub__chain {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    place-items: start;
    background: var(--bg-table);
    margin-bottom: 0.35rem;
    padding: 0.8rem 1rem;
    border-radius: 0.5rem;

    .details {
      display: flex;
      align-items: center;
      gap: 0.8rem;

      .session__summary {
        display: flex;
        align-items: center;

        h4 {
          font-weight: 400;
          font-size: medium;
        }
      }

      .staking__summary {
        display: flex;
        justify-content: end;
      }

      .multiblock__summary, .rcClient__summary {
        display: flex;
        justify-content: end;
        margin-top: 1.5rem;
      }
    }

    .events__summary {
      display: grid;
      gap: 1rem;
      justify-self: center;
      h3 {
        font-weight: 500;
        font-size: var(--font-size-h2);
      }
    }
  }
`;

export default React.memo(AssetHubSection);
