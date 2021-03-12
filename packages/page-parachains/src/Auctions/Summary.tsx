// Copyright 2017-2021 @polkadot/app-auctions authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AuctionIndex, BlockNumber, LeasePeriodOf } from '@polkadot/types/interfaces';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  auctionInfo: [LeasePeriodOf, BlockNumber] | null;
  className?: string;
  numAuctions?: AuctionIndex | null;
}

function Summary ({ auctionInfo, className, numAuctions }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <SummaryBox className={className}>
      <CardSummary label={t<string>('auctions')}>
        {formatNumber(numAuctions)}
      </CardSummary>
      {auctionInfo && (
        <section>
          <CardSummary label={t<string>('period')}>
            {formatNumber(auctionInfo[0])}
          </CardSummary>
          <CardSummary label={t<string>('duration')}>
            {formatNumber(auctionInfo[1])}
          </CardSummary>
        </section>
      )}
    </SummaryBox>
  );
}

export default React.memo(Summary);
