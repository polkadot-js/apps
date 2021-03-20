// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { SortedTargets } from '../types';

import React, { useContext } from 'react';
import styled from 'styled-components';

import SummarySession from '@polkadot/app-explorer/SummarySession';
import { CardSummary, IdentityIcon, Spinner, SummaryBox } from '@polkadot/react-components';
import { BlockAuthorsContext } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  isVisible: boolean;
  nominators?: string[];
  stakingOverview?: DeriveStakingOverview;
  targets: SortedTargets;
}

function Summary ({ className = '', isVisible, stakingOverview, targets: { inflation: { inflation }, nominators, waitingIds } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { lastBlockAuthors, lastBlockNumber } = useContext(BlockAuthorsContext);

  return (
    <SummaryBox className={`${className}${!isVisible ? ' staking--hidden' : ''}`}>
      <section>
        <CardSummary label={t<string>('validators')}>
          {stakingOverview
            ? <>{formatNumber(stakingOverview.validators.length)}&nbsp;/&nbsp;{formatNumber(stakingOverview.validatorCount)}</>
            : <Spinner noLabel />
          }
        </CardSummary>
        <CardSummary
          className='media--1000'
          label={t<string>('waiting')}
        >
          {waitingIds
            ? formatNumber(waitingIds.length)
            : <Spinner noLabel />
          }
        </CardSummary>
        <CardSummary
          className='media--1100'
          label={t<string>('nominators')}
        >
          {nominators
            ? formatNumber(nominators.length)
            : <Spinner noLabel />
          }
        </CardSummary>
        <CardSummary
          className='media--1200'
          label={t<string>('inflation')}
        >
          {(inflation > 0) && Number.isFinite(inflation)
            ? <>{inflation.toFixed(1)}%</>
            : '-'
          }
        </CardSummary>
      </section>
      <section>
        <CardSummary
          className='validator--Summary-authors'
          label={t<string>('last block')}
        >
          {lastBlockAuthors?.map((author): React.ReactNode => (
            <IdentityIcon
              className='validator--Account-block-icon'
              key={author}
              value={author}
            />
          ))}
          {lastBlockNumber}
        </CardSummary>
      </section>
      <section>
        <SummarySession />
      </section>
    </SummaryBox>
  );
}

export default React.memo(styled(Summary)`
  .validator--Account-block-icon {
    display: inline-block;
    margin-right: 0.75rem;
    margin-top: -0.25rem;
    vertical-align: middle;
  }

  .validator--Summary-authors {
    .validator--Account-block-icon+.validator--Account-block-icon {
      margin-left: -1.5rem;
    }
  }
`);
