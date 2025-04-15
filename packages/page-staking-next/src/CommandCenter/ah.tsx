// Copyright 2017-2025 @polkadot/app-staking-next authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IAhOutput } from './index.js';

import React from 'react';
import { Link } from 'react-router-dom';

import { CardSummary, Expander, MarkWarning, styled } from '@polkadot/react-components';
import { Event as EventDisplay } from '@polkadot/react-params';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';

function AssetHubSection ({ ahOutput }: {ahOutput: IAhOutput[]}) {
  const { t } = useTranslation();

  return (
    <div style={{ marginTop: 20 }}>
      <h1 style={{ textTransform: 'capitalize' }}>
        {t('Asset Hub chain')}
      </h1>
      <StyledSection>
        {ahOutput.map((ah) => {
          return (
            <div
              className='relay__chain'
              key={ah.finalizedBlock}
            >
              <div className='details'>
                <div className='session__summary'>
                  <h4 className='--digits'>
                    <Link to={`/explorer/query/${ah.finalizedBlock}`}>#{formatNumber(ah.finalizedBlock)}</Link>
                  </h4>

                </div>
                <div className='stakingNextAhClient__summary'>

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
  max-height: 40vh;
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

      .stakingNextAhClient__summary {
        .stakingNextAhClient__hasQueuedInClient {
          display: flex;
          justify-content: space-evenly;
        }
      }
    }

    .events__summary {
      h3 {
        font-weight: 500;
        font-size: var(--font-size-h2);
      }
    }
  }
`;

export default React.memo(AssetHubSection);
