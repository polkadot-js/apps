// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { SortedTargets } from '../types';

import React from 'react';
import styled from 'styled-components';

import SummarySession from '@polkadot/app-explorer/SummarySession';
import { CardSummary, Spinner, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  nominators?: string[];
  stakingOverview?: DeriveStakingOverview;
  targets: SortedTargets;
}

function Overview ({ className = '', stakingOverview, targets: { counterForNominators, inflation: { idealStake, inflation, stakedFraction }, nominatorMinActiveThreshold, nominators, validatorMinActiveThreshold, waitingIds } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={`staking--Overview ${className}`}>
      <SummaryBox className={className}>
        <section>
          <CardSummary label={t<string>('validators')}>
            {stakingOverview
              ? <>{formatNumber(stakingOverview.validators.length)}&nbsp;/&nbsp;{formatNumber(stakingOverview.validatorCount)}</>
              : <Spinner noLabel />
            }
          </CardSummary>
          <CardSummary
            className='media--900'
            label={t<string>('waiting')}
          >
            {waitingIds
              ? formatNumber(waitingIds.length)
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
        </section>
        <section>
          <SummarySession />
        </section>
      </SummaryBox>
      <SummaryBox className={className}>
        <section>
          <CardSummary
            help={t<string>('Minimum stake among the active nominators.')}
            label={
              <div className='label-floater'>
                {t<string>('nominators')}
                <div>{t<string>('min active stake')}</div>
              </div>
            }
          >
            {nominatorMinActiveThreshold === '' ? <Spinner noLabel /> : nominatorMinActiveThreshold}
          </CardSummary>
          <CardSummary
            help={t<string>('Minimum (total) stake among the active validators.')}
            label={
              <div className='label-floater'>
                {t<string>('validators')}
                <div>{t<string>('min active stake')}</div>
              </div>
            }
          >
            {validatorMinActiveThreshold === '' ? <Spinner noLabel /> : validatorMinActiveThreshold}
          </CardSummary>
        </section>
      </SummaryBox>
    </div>
  );
}

export default React.memo(styled(Overview)`
  .label-floater {
    float: left;
    margin-bottom: 0.75rem;
  }
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
