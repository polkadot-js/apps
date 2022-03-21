// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { SortedTargets } from '../types';

import React from 'react';
import styled from 'styled-components';

import SummarySession from '@polkadot/app-explorer/SummarySession';
import { CardSummary, Spinner, SummaryBox } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  isVisible: boolean;
  nominators?: string[];
  stakingOverview?: DeriveStakingOverview;
  targets: SortedTargets;
}

function Summary ({ className = '', isVisible, targets: { inflation: { idealStake, inflation, stakedFraction }, nominatorMinActiveThreshold, validatorMinActiveThreshold } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <SummaryBox className={`${className}${!isVisible ? ' staking--hidden' : ''}`}>
      <section>
        <CardSummary label={<>{t<string>('nominators')}<div>{t<string>('min active stake')}</div></>}>
          {!nominatorMinActiveThreshold ? <Spinner noLabel /> : nominatorMinActiveThreshold}
        </CardSummary>
        <CardSummary label={<>{t<string>('validators')}<div>{t<string>('min active stake')}</div></>}>
          {validatorMinActiveThreshold === '' ? <Spinner noLabel /> : validatorMinActiveThreshold}
        </CardSummary>
      </section><section>
        {(idealStake > 0) && Number.isFinite(idealStake) && (
          <CardSummary
            className='media--1400'
            label={t<string>('ideal staked')}
          >
            <>{(idealStake * 100).toFixed(1)}%</>
          </CardSummary>
        )}
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
      </section><section>
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
