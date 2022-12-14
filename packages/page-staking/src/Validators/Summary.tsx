// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EraValidators, SortedTargets } from '../types';

import React from 'react';
import styled from 'styled-components';

import SummarySession from '@polkadot/app-explorer/SummarySession';
import { CardSummary, Spinner, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  nominators?: string[];
  targets: SortedTargets;
  eraValidators: EraValidators;
}

function Summary ({ className = '', eraValidators, targets: { counterForNominators, inflation: { idealStake, inflation, stakedFraction }, nominators } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <SummaryBox className={className}>
      <section>
        <CardSummary
          className='media--900'
          label={t<string>('era validators')}
        >
          {eraValidators
            ? formatNumber(eraValidators.reserved.length + eraValidators.nonReserved.length)
            : <Spinner noLabel />
          }
        </CardSummary>
        <CardSummary
          className='media--1000'
          label={
            counterForNominators
              ? t<string>('active / nominators')
              : t<string>('nominators')
          }
        >
          {nominators
            ? (
              <>
                {formatNumber(nominators.length)}
                {counterForNominators && (
                  <>&nbsp;/&nbsp;{formatNumber(counterForNominators)}</>
                )}
              </>
            )
            : <Spinner noLabel />
          }
        </CardSummary>
      </section>
      <section>
        {(stakedFraction > 0) && (
          <CardSummary
            className='media--1300'
            label={t<string>('staked')}
          >
            <>{(stakedFraction * 100).toFixed(1)}%</>
          </CardSummary>
        )}
        {(inflation > 0) && Number.isFinite(inflation) && (
          <CardSummary
            className='media--1200'
            label={t<string>('inflation')}
          >
            <>{inflation.toFixed(1)}%</>
          </CardSummary>
        )}
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
