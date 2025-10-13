// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ReactNode } from 'react';
import type { ApiPromise } from '@polkadot/api';
import type { EnhancedEvent, IAhOutput } from './index.js';

import React from 'react';
import { Link } from 'react-router-dom';

import { CardSummary, Expander, Spinner, styled } from '@polkadot/react-components';
import { Event as EventDisplay } from '@polkadot/react-params';
import { formatBalance, formatNumber } from '@polkadot/util';

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
                <CardSummary label={t('era start session')}>
                  {ahOutput.staking.erasStartSessionIndex || 'None'}
                  {ahOutput.rcClient.eraDepth && `, Era-depth: ${ahOutput.rcClient.eraDepth} sessions`}
                </CardSummary>
                <CardSummary label={t('bonded eras')}>
                  {ahOutput.staking.bondedEras && ahOutput.staking.bondedEras.length > 0
                    ? (() => {
                      const firstEra = ahOutput.staking.bondedEras[0];
                      const lastEra = ahOutput.staking.bondedEras[ahOutput.staking.bondedEras.length - 1];

                      return `[(${firstEra[0].toString()}@${firstEra[1].toString()}) -> (${lastEra[0].toString()}@${lastEra[1].toString()})]`;
                    })()
                    : 'None'}
                </CardSummary>
                <CardSummary label={t('unpruned eras')}>
                  {ahOutput.staking.unprunedEras}
                </CardSummary>
                <CardSummary label={t('forcing')}>
                  {ahOutput.staking.forcing || 'None'}
                </CardSummary>
              </div>
            </div>
            <div className='section'>
              <h4>{t('Staking RC Client')}</h4>
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
                <CardSummary label={t('queued score')}>
                  {ahOutput.multiblock.queuedScore || 'None'}
                </CardSummary>
                <CardSummary label={t('snapshot range')}>
                  {ahOutput.multiblock.snapshotRange.length > 0
                    ? (() => {
                      const uniquePages = Array.from(new Set(ahOutput.multiblock.snapshotRange.map((p) => Number(p.toString())))).sort((a, b) => a - b);
                      const [minPage, maxPage] = [uniquePages[0], uniquePages[uniquePages.length - 1]];

                      return `${minPage} → ${maxPage}`;
                    })()
                    : 'None'}
                </CardSummary>
              </div>
            </div>
            <div className='section'>
              <h4>{t('Validators/Nominators')}</h4>
              <div className='stats'>
                <CardSummary label={t('wanted validators')}>
                  {ahOutput.staking.validatorCount || 'None'}
                </CardSummary>
                <CardSummary label={t('validator candidates')}>
                  {ahOutput.staking.validatorCandidates
                    ? `${ahOutput.staking.validatorCandidates}${ahOutput.staking.maxValidatorsCount ? ` (max: ${ahOutput.staking.maxValidatorsCount})` : ''}`
                    : 'None'}
                </CardSummary>
                <CardSummary label={t('nominator candidates')}>
                  {ahOutput.staking.nominatorCandidates
                    ? `${ahOutput.staking.nominatorCandidates}${ahOutput.staking.maxNominatorsCount ? ` (max: ${ahOutput.staking.maxNominatorsCount})` : ''}`
                    : 'None'}
                </CardSummary>
                <CardSummary label={t('min bonds')}>
                  {ahOutput.staking.minNominatorBond || ahOutput.staking.minValidatorBond || ahOutput.staking.minNominatorActiveStake
                    ? `${ahOutput.staking.minNominatorBond ? `N: ${formatBalance(ahOutput.staking.minNominatorBond, { forceUnit: '-', withSi: true })}` : ''}${ahOutput.staking.minValidatorBond ? ` / V: ${formatBalance(ahOutput.staking.minValidatorBond, { forceUnit: '-', withSi: true })}` : ''}${ahOutput.staking.minNominatorActiveStake ? ` / Active: ${formatBalance(ahOutput.staking.minNominatorActiveStake, { forceUnit: '-', withSi: true })}` : ''}`
                    : 'None'}
                </CardSummary>
              </div>
            </div>
            <div className='section'>
              <h4>{t('Bags List')}</h4>
              <div className='stats'>
                <CardSummary label={t('all nodes')}>
                  {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                  {ahOutput.bagsList ? ahOutput.bagsList.allNodes : 'None'}
                </CardSummary>
                <CardSummary label={t('lock')}>
                  {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                  {ahOutput.bagsList ? ahOutput.bagsList.lock : 'None'}
                </CardSummary>
              </div>
            </div>
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
                <>
                  {eventName}
                  <div className='absolute --digits'>
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
                </>
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
        font-size: var(--font-size-base);
        font-weight: 500;
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

    .ui--Labelled {
      label {
        font-size: medium !important;
        text-align: left !important;
      }

      .ui--Labelled-content {
        font-size: small !important;
        text-align: left !important;
      }
    }
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
    position: relative;

    .absolute {
      position: absolute;
      right: 0.5rem;
      top: 0.72rem;
      white-space: nowrap;

      .weight {
        color: var(--color-text-secondary);
        font-size: var(--font-size-small);
        margin-right: 0.5rem;
      }
    }
  }
`;

export default React.memo(AssetHubSection);
