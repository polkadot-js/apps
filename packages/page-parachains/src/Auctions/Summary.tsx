// Copyright 2017-2021 @polkadot/app-auctions authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AuctionIndex } from '@polkadot/types/interfaces';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  numAuctions?: AuctionIndex | null;
}

function Summary ({ className, numAuctions }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <SummaryBox className={className}>
      <CardSummary label={t<string>('auctions')}>
        {formatNumber(numAuctions)}
      </CardSummary>
    </SummaryBox>
  );
}

export default React.memo(Summary);
