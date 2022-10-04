// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import { Card, CardSummary, SummaryBox } from '@polkadot/react-components';
import { useCall } from '@polkadot/react-hooks';
import { StakerState } from '@polkadot/react-hooks/types';
import { formatNumber } from '@polkadot/util';

import useBagsList from '../Bags/useBagsList';
import useBagsNodes from '../Bags/useBagsNodes';
import useQueryModule from '../Bags/useQueryModule';
import { useTranslation } from '../translate';
import { Section, Title } from './index';
import SpinnerWrap from './SpinnerWrap';

interface Props {
  ownStashes?: StakerState[];
}

function SummaryBags ({ ownStashes }: Props) {
  const { t } = useTranslation();
  const mod = useQueryModule();
  const stashIds = useMemo(
    () => ownStashes
      ? ownStashes.map(({ stashId }) => stashId)
      : [],
    [ownStashes]
  );
  const mapOwn = useBagsNodes(stashIds);
  const bags = useBagsList();
  const total = useCall<BN>(mod.counterForListNodes);

  return (
    <Card>
      <Title>{t<string>('bags')}</Title>
      <SummaryBox>
        <Section>
          <CardSummary label={t<string>('total bags')}>
            <SpinnerWrap check={bags}>
              {formatNumber(bags?.length)}
            </SpinnerWrap>
          </CardSummary>
        </Section>
        <Section>
          <CardSummary label={t<string>('total nodes')}>
            <SpinnerWrap check={!!mapOwn}>
              {formatNumber(total)}
            </SpinnerWrap>
          </CardSummary>
        </Section>
      </SummaryBox>
    </Card>
  );
}

export default SummaryBags;
