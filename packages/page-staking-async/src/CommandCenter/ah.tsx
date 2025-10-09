// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ReactNode } from 'react';
import type { ApiPromise } from '@polkadot/api';
import type { EnhancedEvent, IAhOutput } from './index.js';

import React from 'react';
import { Link } from 'react-router-dom';

import { CardSummary, Expander, Spinner, styled } from '@polkadot/react-components';
import { Event as EventDisplay } from '@polkadot/react-params';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  children: ReactNode;
  ahApi?: ApiPromise;
  ahOutput?: IAhOutput;
  ahEvents: EnhancedEvent[];
  ahUrl: string;
  isRelayChain: boolean
}

function AssetHubSection ({ ahApi, ahEvents, ahOutput, ahUrl, children, isRelayChain }: Props) {
  const { t } = useTranslation();

  return (
    <StyledColumn>
      <StyledInfoBox>
        <h2>
          {t('Asset Hub')}
          {children}
        </h2>
        {!ahApi && <Spinner label={t('Connecting to Asset Hub')} />}
        {ahOutput && (
          <div className='info-content'>
            <div className='block-info'>
              {!isRelayChain
                ? <Link to={`/explorer/query/${ahOutput.finalizedBlock}`}>#{formatNumber(ahOutput.finalizedBlock)}</Link>
                : (
                  <Link
                    target='_blank'
                    to={`${window.location.origin}/?rpc=${ahUrl}#/explorer/query/${ahOutput.finalizedBlock}`}
                  >
                    #{formatNumber(ahOutput.finalizedBlock)}
                  </Link>)
              }
            </div>

            <div className='section'>
              <h4>{t('Staking')}</h4>
              <div className='stats'>
                <CardSummary label={t('current era')}>
                  {ahOutput.staking.currentEra}
                </CardSummary>
                <CardSummary label={t('active era')}>
                  {ahOutput.staking.activeEra.index}
                  {ahOutput.staking.activeEra.duration && ` (${ahOutput.staking.activeEra.duration})`}
                </CardSummary>
                {ahOutput.staking.erasStartSessionIndex &&
                  <CardSummary label={t('era start session')}>
                    {ahOutput.staking.erasStartSessionIndex}
                    {ahOutput.rcClient.eraDepth && `, Era-depth: ${ahOutput.rcClient.eraDepth} sessions`}
                  </CardSummary>
                }
                {ahOutput.staking.bondedEras && ahOutput.staking.bondedEras.length > 0 && (() => {
                  const firstEra = ahOutput.staking.bondedEras[0];
                  const lastEra = ahOutput.staking.bondedEras[ahOutput.staking.bondedEras.length - 1];

                  return (
                    <CardSummary label={t('bonded eras')}>
                      {`(${firstEra[0]} @ ${firstEra[1]}), (${lastEra[0]} @ ${lastEra[1]})`}
                    </CardSummary>
                  );
                })()}
                <CardSummary label={t('unpruned eras')}>
                  {ahOutput.staking.unprunedEras}
                </CardSummary>
                {ahOutput.staking.forcing &&
                  <CardSummary label={t('forcing')}>
                    {ahOutput.staking.forcing}
                  </CardSummary>
                }
              </div>
            </div>

            <div className='section'>
              <h4>{t('Validators/Nominators')}</h4>
              <div className='stats'>
                {ahOutput.staking.validatorCount &&
                  <CardSummary label={t('wanted validators')}>
                    {ahOutput.staking.validatorCount}
                  </CardSummary>
                }
                {ahOutput.staking.validatorCandidates &&
                  <CardSummary label={t('validator candidates')}>
                    {ahOutput.staking.validatorCandidates}
                    {ahOutput.staking.maxValidatorsCount && ` (max: ${ahOutput.staking.maxValidatorsCount})`}
                  </CardSummary>
                }
                {ahOutput.staking.nominatorCandidates &&
                  <CardSummary label={t('nominator candidates')}>
                    {ahOutput.staking.nominatorCandidates}
                    {ahOutput.staking.maxNominatorsCount && ` (max: ${ahOutput.staking.maxNominatorsCount})`}
                  </CardSummary>
                }
                {(ahOutput.staking.minNominatorBond || ahOutput.staking.minValidatorBond || ahOutput.staking.minNominatorActiveStake) &&
                  <CardSummary label={t('min bonds')}>
                    {ahOutput.staking.minNominatorBond && `N: ${ahOutput.staking.minNominatorBond}`}
                    {ahOutput.staking.minValidatorBond && ` / V: ${ahOutput.staking.minValidatorBond}`}
                    {ahOutput.staking.minNominatorActiveStake && ` / Active: ${ahOutput.staking.minNominatorActiveStake}`}
                  </CardSummary>
                }
              </div>
            </div>

            <div className='section'>
              <h4>{t('RC Client')}</h4>
              <div className='stats'>
                <CardSummary label={t('last session report')}>
                  End={ahOutput.rcClient.lastSessionReportEndIndex}, Start={ahOutput.rcClient.lastSessionIndex}
                </CardSummary>
              </div>
            </div>

            <div className='section'>
              <h4>{t('Election')}</h4>
              <div className='stats'>
                <CardSummary label={t('phase')}>
                  {ahOutput.multiblock.phase}
                </CardSummary>
                <CardSummary label={t('round')}>
                  {ahOutput.multiblock.round}
                </CardSummary>
                <CardSummary label={t('signed submissions')}>
                  {ahOutput.multiblock.signedSubmissions}
                </CardSummary>
                {ahOutput.multiblock.queuedScore &&
                  <CardSummary label={t('queued score')}>
                    {ahOutput.multiblock.queuedScore}
                  </CardSummary>
                }
                {ahOutput.multiblock.snapshotRange.length > 0 && (() => {
                  const uniquePages = Array.from(new Set(ahOutput.multiblock.snapshotRange.map((p) => Number(p.toString())))).sort((a, b) => a - b);
                  const [minPage, maxPage] = [uniquePages[0], uniquePages[uniquePages.length - 1]];

                  return (
                    <CardSummary label={t('snapshot range')}>
                      {`${minPage} → ${maxPage}`}
                    </CardSummary>
                  );
                })()}
              </div>
            </div>

            {ahOutput.bagsList && (
              <div className='section'>
                <h4>{t('Bags List')}</h4>
                <div className='stats'>
                  <CardSummary label={t('all nodes')}>
                    {ahOutput.bagsList.allNodes}
                  </CardSummary>
                  <CardSummary label={t('lock')}>
                    {ahOutput.bagsList.lock}
                  </CardSummary>
                </div>
              </div>
            )}
          </div>
        )}
      </StyledInfoBox>
      <StyledEventsBox>
        <h3>{t('Asset Hub Events')}</h3>
        {ahEvents.length === 0 && (
          <div className='no-events'>
            {t('No relevant events in recent blocks')}
          </div>
        )}
        {ahEvents.map((enhancedEvent, index) => {
          const { blockNumber, event, weight } = enhancedEvent;
          const eventName = `${event.section}.${event.method}`;

          return (
            <Expander
              isLeft
              key={`${event.index.toString()}-${index}`}
              summary={
                <div className='event-summary'>
                  <span>{eventName}</span>
                  <div className='event-meta'>
                    {weight && <span className='weight'>[{weight}]</span>}
                    {!isRelayChain
                      ? <Link to={`/explorer/query/${blockNumber}`}>#{formatNumber(blockNumber)}</Link>
                      : (
                        <Link
                          target='_blank'
                          to={`${window.location.origin}/?rpc=${ahUrl}#/explorer/query/${blockNumber}`}
                        >
                          #{formatNumber(blockNumber)}
                        </Link>)
                    }
                  </div>
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

    .event-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .weight {
        color: var(--color-text-secondary);
        font-size: var(--font-size-small);
      }

      a {
        color: var(--color-link);
        font-weight: 500;
        white-space: nowrap;
      }
    }
  }
`;

export default React.memo(AssetHubSection);
