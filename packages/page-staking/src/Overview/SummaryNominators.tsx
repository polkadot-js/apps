// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Card, CardSummary, SummaryBox } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import { SortedTargets } from '../types';
import { Section, Title } from './index';
import SpinnerWrap from './SpinnerWrap';

interface Props {
  targets: SortedTargets;
}

function SummaryNominators ({ targets: { maxNominatorsCount,
  minNominatorBond,
  nominatorActiveCount,
  nominatorElectingCount,
  nominatorMinActiveThreshold } }: Props) {
  const { t } = useTranslation();

  return (
    <Card withBottomMargin>
      <Title>{t<string>('nominators')}</Title>
      <SummaryBox>
        <Section>
          <CardSummary
            help={t<string>('Maximum number of nominator intentions.')}
            label={t<string>('maximum')}
          >
            <SpinnerWrap check={maxNominatorsCount}>
              {formatNumber(maxNominatorsCount?.toNumber())}
            </SpinnerWrap>
          </CardSummary>
        </Section>
        <Section>
          <CardSummary
            help={t<string>('Number of electing nominators.')}
            label={t<string>('electing')}
          >
            <SpinnerWrap check={nominatorElectingCount}>
              {formatNumber(nominatorElectingCount)}
            </SpinnerWrap>
          </CardSummary>
        </Section>
        <Section>
          <CardSummary
            help={t<string>('Active count of nominators.')}
            label={t<string>('active')}
          >
            <SpinnerWrap check={nominatorActiveCount}>
              {formatNumber(nominatorActiveCount)}
            </SpinnerWrap>
          </CardSummary>
        </Section>
      </SummaryBox>
      <SummaryBox>
        <Section>
          <CardSummary
            help={t<string>('Threshold stake among intended nominators.')}
            label={t<string>('intention thrs')}
          >
            <SpinnerWrap check={minNominatorBond}>
              <FormatBalance
                value={minNominatorBond}
                withSi
              />
            </SpinnerWrap>
          </CardSummary>
        </Section>
        <Section>
          <CardSummary
            help={t<string>('Minimum threshold stake among active nominators.')}
            label={t<string>('min active thrs')}
          >
            <SpinnerWrap check={nominatorMinActiveThreshold}>
              {nominatorMinActiveThreshold}
            </SpinnerWrap>
          </CardSummary>
        </Section>
        <Section>
          {/** Average Stake of Active Nominators? */}
        </Section>
      </SummaryBox>
    </Card>
  );
}

export default SummaryNominators;
