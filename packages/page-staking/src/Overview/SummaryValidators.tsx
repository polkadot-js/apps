// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Card, CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import { SortedTargets } from '../types';
import { Section, Title } from './index';
import SpinnerWrap from './SpinnerWrap';

interface Props {
  targets: SortedTargets;
}

function SummaryValidators ({ targets:
  { avgStaked,
    maxValidatorsCount,
    minValidatorBond,
    validatorActiveCount,
    validatorMinActiveThreshold,
    waitingIds } }: Props) {
  const { t } = useTranslation();
  const { api } = useApi();

  const maxValidatorDefined = !!api.query.staking.maxValidatorsCount && maxValidatorsCount !== undefined;
  const minValidatorBondDefined = !!api.query.staking.minValidatorBond && minValidatorBond !== undefined;
  const validatorMinActiveThresholdDefined = !!api.query.staking.erasStakers && validatorMinActiveThreshold !== undefined;
  const validatorActiveCountDefined = !!api.query.staking.erasStakers && validatorActiveCount !== undefined;

  return (
    <Card withBottomMargin>
      <Title>{t<string>('validators')}</Title>
      <SummaryBox>
        <Section>
          <CardSummary
            help={t<string>('Maximum number of validator intentions.')}
            label={t<string>('max intention')}
          >
            {maxValidatorDefined
              ? <SpinnerWrap check={maxValidatorsCount}>
                {maxValidatorsCount?.toNumber()}
              </SpinnerWrap>
              : '-'}
          </CardSummary>
        </Section>
        <Section>
          <CardSummary
            help={t<string>('Count of waiting validators.')}
            label={t<string>('waiting')}
          >
            <SpinnerWrap check={waitingIds}>
              {formatNumber(waitingIds?.length)}
            </SpinnerWrap>
          </CardSummary>
        </Section>
        <Section>
          <CardSummary
            help={t<string>('Count of active validators.')}
            label={t<string>('active')}
          >
            {validatorActiveCountDefined
              ? <SpinnerWrap check={validatorActiveCount}>
                {validatorActiveCount}
              </SpinnerWrap>
              : '-'}
          </CardSummary>
        </Section>
      </SummaryBox>
      <SummaryBox>
        <Section>
          <CardSummary
            help={t<string>('Threshold stake among intended validators.')}
            label={t<string>('intention thrs')}
          >
            {minValidatorBondDefined
              ? <SpinnerWrap check={minValidatorBond}>
                <FormatBalance
                  value={minValidatorBond}
                  withSi
                />
              </SpinnerWrap>
              : '-'}
          </CardSummary>
        </Section>
        <Section>
          <CardSummary
            help={t<string>('Minimum threshold stake among active validators.')}
            label={t<string>('min active thrs')}
          >
            {validatorMinActiveThresholdDefined
              ? <SpinnerWrap check={validatorMinActiveThreshold}>
                {validatorMinActiveThreshold}
              </SpinnerWrap>
              : '-'}
          </CardSummary>
        </Section>
        <Section>
          <CardSummary
            help={t<string>('Average stake among active validators.')}
            label={t<string>('average active stake')}
          >
            <SpinnerWrap check={avgStaked}>
              <FormatBalance
                value={avgStaked}
                withSi
              />
            </SpinnerWrap>
          </CardSummary>
        </Section>
      </SummaryBox>
    </Card>
  );
}

export default SummaryValidators;
