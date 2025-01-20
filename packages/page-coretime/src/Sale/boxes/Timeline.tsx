// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SaleParameters } from 'page-coretime/src/types.js';
import type { ProgressBarSection } from '@polkadot/react-components/types';
import type { CoretimeInformation } from '@polkadot/react-hooks/types';

import React, { useMemo } from 'react';

import { CardSummary, ProgressBar, styled, SummaryBox } from '@polkadot/react-components';
import { formatBalance, formatNumber } from '@polkadot/util';

import { useTranslation } from '../../translate.js';
import { getSaleProgress } from '../../utils/sale.js';
import { WhiteBox } from '../../WhiteBox.js';

const TimelineWrapper = styled(WhiteBox)`
  justify-self: flex-start;

  @media (min-width: 769px) and (max-width: 1024px) {
    width: 100%;
  }
`;

interface TimelineProps {
  phaseName: string;
  saleParams: SaleParameters;
  coretimeInfo: {
    salesInfo: CoretimeInformation['salesInfo'];
    status: CoretimeInformation['status'];
  };
  color: string;
}

export const Timeline = ({ color, coretimeInfo: { salesInfo, status }, phaseName, saleParams }: TimelineProps) => {
  const { t } = useTranslation();
  const progressValues = useMemo(() => saleParams && salesInfo.regionBegin &&
    getSaleProgress(
      status.lastTimeslice,
      saleParams.currentRegion.start.ts,
      saleParams.interlude.ts,
      saleParams.leadin.ts,
      salesInfo.regionBegin),
  [saleParams, status.lastTimeslice, salesInfo.regionBegin]);

  return (
    <TimelineWrapper>
      <p style={{ fontSize: '16px', fontWeight: 'bold' }}>{t('Sale timeline')}</p>
      <SummaryBox>
        <section>
          {phaseName && <>
            <CardSummary label='current phase'>{phaseName}</CardSummary>
            <CardSummary label='current phase end'>{saleParams?.phaseConfig?.config[phaseName as keyof typeof saleParams.phaseConfig.config].end.date}</CardSummary>
            <CardSummary label='last phase block'>{formatNumber(saleParams?.phaseConfig?.config[phaseName as keyof typeof saleParams.phaseConfig.config].end.blocks.relay)}</CardSummary>
          </>}
          <CardSummary label='fixed price'>{formatBalance(salesInfo.endPrice)}</CardSummary>
        </section>
        <section>

        </section>
      </SummaryBox>
      <ProgressBar
        color={color}
        sections={progressValues as ProgressBarSection[] ?? []}
      />
    </TimelineWrapper>
  );
};
