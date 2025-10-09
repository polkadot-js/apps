// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ReactNode } from 'react';
import type { ApiPromise } from '@polkadot/api';
import type { EnhancedEvent, IRcOutput } from './index.js';

import React from 'react';
import { Link } from 'react-router-dom';

import { CardSummary, Expander, MarkWarning, Spinner, styled } from '@polkadot/react-components';
import { Event as EventDisplay } from '@polkadot/react-params';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  children: ReactNode;
  rcApi?: ApiPromise;
  rcOutput?: IRcOutput;
  rcEvents: EnhancedEvent[];
  rcUrl: string;
  isRelayChain: boolean
}

function RelaySection ({ children, isRelayChain, rcApi, rcEvents, rcOutput, rcUrl }: Props) {
  const { t } = useTranslation();

  return (
    <StyledColumn>
      <StyledInfoBox>
        <h2>
          {t('Relay Chain')}
          {children}
        </h2>
        {!rcApi && <Spinner label={t('Connecting to Relay chain')} />}
        {rcOutput && (
          <div className='info-content'>
            <div className='block-info'>
              {isRelayChain
                ? <Link to={`/explorer/query/${rcOutput.finalizedBlock}`}>#{formatNumber(rcOutput.finalizedBlock)}</Link>
                : (
                  <Link
                    target='_blank'
                    to={`${window.location.origin}/?rpc=${rcUrl}#/explorer/query/${rcOutput.finalizedBlock}`}
                  >
                    #{formatNumber(rcOutput.finalizedBlock)}
                  </Link>)
              }
            </div>

            <div className='section'>
              <h4>{t('Session Info')}</h4>
              <div className='stats'>
                <CardSummary label={t('session')}>
                  #{formatNumber(rcOutput.session.index)}
                </CardSummary>
                <CardSummary label={t('queued')}>
                  {rcOutput.session.hasQueuedInSession ? 'Yes' : 'No'}
                </CardSummary>
                {rcOutput.session.historicalRange &&
                  <CardSummary label={t('historical range')}>
                    {`${rcOutput.session.historicalRange[0]} → ${rcOutput.session.historicalRange[1]}`}
                  </CardSummary>
                }
              </div>
            </div>

            <div className='section'>
              <h4>{t('Staking AH Client')}</h4>
              <div className='stats'>
                <CardSummary label={t('mode')}>
                  {rcOutput.stakingAhClient.mode}
                </CardSummary>
                {rcOutput.stakingAhClient.hasNextActiveId !== undefined &&
                  <CardSummary label={t('next active id')}>
                    {rcOutput.stakingAhClient.hasNextActiveId}
                  </CardSummary>
                }
                <CardSummary label={t('validator points')}>
                  {rcOutput.stakingAhClient.validatorPoints}
                </CardSummary>
              </div>
              {rcOutput.stakingAhClient.hasQueuedInClient &&
                <div className='warning-section'>
                  <MarkWarning content={t('Validator set queued')} />
                  <CardSummary label={t('id')}>
                    {rcOutput.stakingAhClient.hasQueuedInClient[0]}
                  </CardSummary>
                  <CardSummary label={t('validators')}>
                    {rcOutput.stakingAhClient.hasQueuedInClient[1].length}
                  </CardSummary>
                </div>
              }
            </div>

            {(rcOutput.staking.forceEra || rcOutput.staking.validatorCount || rcOutput.staking.electionPhase) && (
              <div className='section'>
                <h4>{t('Staking/Elections')}</h4>
                <div className='stats'>
                  {rcOutput.staking.forceEra &&
                    <CardSummary label={t('force era')}>
                      {rcOutput.staking.forceEra}
                    </CardSummary>
                  }
                  {rcOutput.staking.electionPhase &&
                    <CardSummary label={t('election phase')}>
                      {rcOutput.staking.electionPhase}
                    </CardSummary>
                  }
                  {rcOutput.staking.validatorCount &&
                    <CardSummary label={t('validator count')}>
                      {rcOutput.staking.validatorCount}
                    </CardSummary>
                  }
                </div>
              </div>
            )}

            {rcOutput.parachainConfig && (
              <div className='section'>
                <h4>{t('Parachain Config')}</h4>
                <div className='stats'>
                  <CardSummary label={t('max downward msg size')}>
                    {formatNumber(rcOutput.parachainConfig.maxDownwardMessageSize)}
                  </CardSummary>
                  <CardSummary label={t('max upward msg size')}>
                    {formatNumber(rcOutput.parachainConfig.maxUpwardMessageSize)}
                  </CardSummary>
                </div>
              </div>
            )}
          </div>
        )}
      </StyledInfoBox>
      <StyledEventsBox>
        <h3>{t('Relay Chain Events')}</h3>
        {rcEvents.length === 0 && (
          <div className='no-events'>
            {t('No relevant events in recent blocks')}
          </div>
        )}
        {rcEvents.map((enhancedEvent, index) => {
          const { blockNumber, event } = enhancedEvent;
          const eventName = `${event.section}.${event.method}`;

          return (
            <Expander
              isLeft
              key={`${event.index.toString()}-${index}`}
              summary={
                <div className='event-summary'>
                  <span>{eventName}</span>
                  {isRelayChain
                    ? <Link to={`/explorer/query/${blockNumber}`}>#{formatNumber(blockNumber)}</Link>
                    : (
                      <Link
                        target='_blank'
                        to={`${window.location.origin}/?rpc=${rcUrl}#/explorer/query/${blockNumber}`}
                      >
                        #{formatNumber(blockNumber)}
                      </Link>)
                  }
                </div>
              }
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
      </StyledEventsBox>
    </StyledColumn>
  );
}

const StyledColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledInfoBox = styled.div`
  background: var(--bg-table);
  padding: 1.5rem;
  border-radius: 0.5rem;

  h2 {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: var(--font-size-h2);
    font-weight: 500;
  }

  .info-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .block-info {
      font-size: var(--font-size-h3);
      font-weight: 600;
    }

    .section {
      h4 {
        font-size: var(--font-size-small);
        font-weight: 600;
        color: var(--color-text-secondary);
        text-transform: uppercase;
        margin-bottom: 0.5rem;
        letter-spacing: 0.05em;
      }
    }

    .stats {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .warning-section {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem;
      background: var(--bg-page);
      border-radius: 0.25rem;
      margin-top: 0.5rem;

      .warning {
        margin: 0;
      }
    }
  }

  .ui--Labelled-content {
    font-size: var(--font-size-h3);
  }
`;

const StyledEventsBox = styled.div`
  background: var(--bg-table);
  padding: 1.5rem;
  border-radius: 0.5rem;
  max-height: 500px;
  overflow-y: auto;

  h3 {
    margin-bottom: 1rem;
    font-size: var(--font-size-h3);
    font-weight: 500;
  }

  .no-events {
    color: var(--color-text-secondary);
    font-style: italic;
    padding: 1rem;
    text-align: center;
  }

  .ui--Expander {
    margin-bottom: 0.5rem;
  }

  .event-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 1rem;

    a {
      color: var(--color-link);
      font-weight: 500;
      white-space: nowrap;
    }
  }
`;

export default React.memo(RelaySection);
