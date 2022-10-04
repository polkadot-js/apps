// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import SummarySession from '@polkadot/app-explorer/SummarySession';
import { Card, CardSummary, SummaryBox } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';
import { SortedTargets } from '../types';
import { Section } from './index';
import SpinnerWrap from './SpinnerWrap';

interface Props {
  targets: SortedTargets;
}

interface ProgressInfo {
  hideValue: true;
  total: BN;
  value: BN;
}

function getProgressInfo (value?: BN, total?: BN): ProgressInfo | undefined {
  return value && total && !total.isZero()
    ? {
      hideValue: true,
      total,
      value
    }
    : undefined;
}

function SummaryGeneral ({ targets: { inflation: { idealStake,
  inflation,
  stakedReturn },
totalIssuance,
totalStaked } }: Props) {
  const { t } = useTranslation();

  const progressStake = useMemo(
    () => getProgressInfo(totalStaked, totalIssuance),
    [totalIssuance, totalStaked]
  );

  const returnsCheck: string = useMemo(
    () => {
      if (totalIssuance && stakedReturn > 0 && Number.isFinite(stakedReturn)) {
        return (stakedReturn.toFixed(1) + '%');
      }

      return '0%';
    }, [totalIssuance, stakedReturn]);

  return (
    <Card withBottomMargin>
      <SummaryBox>
        <Section>
          <SummarySession />
        </Section>
        <Section>
          <CardSummary
            label={t<string>('total staked')}
            progress={progressStake}
          >
            <SpinnerWrap check={progressStake}>
              <FormatBalance
                value={totalStaked}
                withSi
              />
            </SpinnerWrap>
          </CardSummary>
        </Section>
        <Section
          className='media--900'
        >
          <CardSummary
            label={t<string>('ideal staked')}
          >
            <SpinnerWrap
              check={(idealStake > 0) && Number.isFinite(idealStake)}
            >
              {(idealStake * 100).toFixed(1)}%
            </SpinnerWrap>
          </CardSummary>
          <CardSummary
            label={t<string>('inflation')}
          >
            <SpinnerWrap
              check={(inflation > 0) && Number.isFinite(inflation)}
            >{inflation.toFixed(1)}%</SpinnerWrap>
          </CardSummary>
          <CardSummary label={t<string>('returns')}>
            {returnsCheck}
          </CardSummary>
        </Section>
      </SummaryBox>
    </Card>
  );
}

export default SummaryGeneral;
