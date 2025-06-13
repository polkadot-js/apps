// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ReactNode } from 'react';
import type { ApiPromise } from '@polkadot/api';
import type { IRcOutput } from './index.js';

import React from 'react';
import { Link } from 'react-router-dom';

import { CardSummary, Expander, MarkWarning, Spinner, styled } from '@polkadot/react-components';
import { Event as EventDisplay } from '@polkadot/react-params';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  children: ReactNode;
  rcApi?: ApiPromise;
  rcOutput: IRcOutput[];
  rcUrl: string;
  isRelayChain: boolean
}

function RelaySection ({ children, isRelayChain, rcApi, rcOutput, rcUrl }: Props) {
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
        {t('Relay chain')}
        {children}
      </h1>
      {!rcApi && <Spinner label='Connecting to Relay chain' />}
      <StyledSection>
        {rcOutput.map((rc) => {
          return (
            <div
              className='relay__chain'
              key={rc.finalizedBlock}
            >
              <div className='details'>
                <div className='session__summary'>
                  <h4 className='--digits'>
                    {isRelayChain
                      ? <Link to={`/explorer/query/${rc.finalizedBlock}`}>#{formatNumber(rc.finalizedBlock)}</Link>
                      : (
                        <Link
                          target='_blank'
                          to={`${window.location.origin}/?rpc=${rcUrl}#/explorer/query/${rc.finalizedBlock}`}
                        >
                          #{formatNumber(rc.finalizedBlock)}
                        </Link>)
                    }
                  </h4>
                  <CardSummary label={t('session')}>
                          #{formatNumber(rc.session.index)}
                  </CardSummary>
                  {rc.session.historicalRange &&
                      <CardSummary label={t('historical range')}>
                          [{rc.session.historicalRange?.[0]}, {rc.session.historicalRange?.[1]}]
                      </CardSummary>
                  }
                </div>
                <div className='stakingAhClient__summary'>
                  <MarkWarning content={rc.stakingAhClient.mode} />
                  {rc.stakingAhClient.hasQueuedInClient &&
                      <div className='stakingAhClient__hasQueuedInClient'>
                        <MarkWarning content={t('There is a validator set queued in ah-client.')} />
                        <CardSummary label={t('id')}>
                          {rc.stakingAhClient.hasQueuedInClient[0]}
                        </CardSummary>
                        <CardSummary label={t('number of validators')}>
                          {rc.stakingAhClient.hasQueuedInClient[1].length}
                        </CardSummary>
                      </div>}
                </div>
              </div>
              <div className='events__summary'>
                <h3>{t('events')}</h3>
                {rc.events.map((event) => {
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
                {rc.events.length === 0 && <MarkWarning content={t('No events available')} />}
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

  .warning {
    max-width: fit-content;
    margin-left: 0;
  }

  .ui--Labelled-content {
    font-size: var(--font-size-h3);
    font-weight: var(--font-weight-normal);
  }

  .relay__chain {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    background: var(--bg-table);
    margin-bottom: 0.35rem;
    padding: 0.8rem 1rem;
    border-radius: 0.5rem;

    .details {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;

      .session__summary {
        display: flex;
        align-items: center;

        h4 {
          font-weight: 400;
          font-size: medium;
        }
      }

      .stakingAhClient__summary {
        .stakingAhClient__hasQueuedInClient {
          display: flex;
          justify-content: space-evenly;
        }
      }
    }

    .events__summary {
      justify-self: center;
      h3 {
        font-weight: 500;
        font-size: var(--font-size-h2);
      }
    }
  }
`;

export default React.memo(RelaySection);
