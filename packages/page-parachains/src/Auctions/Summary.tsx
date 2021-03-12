// Copyright 2017-2021 @polkadot/app-auctions authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AuctionIndex, BlockNumber, LeasePeriodOf } from '@polkadot/types/interfaces';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  auctionInfo: [LeasePeriodOf, BlockNumber] | null;
  bestNumber?: BlockNumber;
  className?: string;
  numAuctions?: AuctionIndex | null;
}

function Summary ({ auctionInfo, bestNumber, className, numAuctions }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [period, ending] = auctionInfo || [];

  return (
    <SummaryBox className={className}>
      <CardSummary label={t<string>('auctions')}>
        {formatNumber(numAuctions)}
      </CardSummary>
      {auctionInfo && (
        <section>
          <CardSummary label={t<string>('period')}>
            {formatNumber(period)}
          </CardSummary>
          <CardSummary
            label={t<string>('ending')}
            progress={{
              total: ending,
              value: bestNumber,
              withTime: true,
              withTimeNumber: true
            }}
          />
        </section>
      )}
    </SummaryBox>
  );
}

export default React.memo(Summary);
