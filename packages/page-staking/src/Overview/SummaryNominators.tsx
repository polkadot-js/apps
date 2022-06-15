// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Card, CardSummary, MarkWarning, SummaryBox } from '@polkadot/react-components';
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
  nominatorMaxElectingCount,
  nominatorMinActiveThreshold } }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <MarkWarning
        content={t<string>('In order to receive staking rewards, and be exposed with an active validator to slash, a nominator needs to be "active". Compare the below thresholds with your active stake to ensure you are in the correct set between "active" and "intention".')}
        withIcon={false}
      >
        <a
          href='https://wiki.polkadot.network/docs/learn-nominator'
          rel='noreferrer'
          target='_blank'
        >Learn More</a>
      </MarkWarning>
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
              {nominatorMaxElectingCount === null
                ? <>-</>
                : <SpinnerWrap check={nominatorMaxElectingCount}>
                  {formatNumber(nominatorMaxElectingCount)}
                </SpinnerWrap>}
            </CardSummary>
          </Section>
          <Section>
            <CardSummary
              help={t<string>('Number of nominators backing active validators in the current era.')}
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
              help={t<string>('Threshold stake to intend nomination.')}
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
    </>
  );
}

export default SummaryNominators;
