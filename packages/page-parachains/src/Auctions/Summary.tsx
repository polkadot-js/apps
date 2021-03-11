// Copyright 2017-2021 @polkadot/app-auctions authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AuctionIndex } from '@polkadot/types/interfaces';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
}

function Summary ({ className }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const numAuctions = useCall<AuctionIndex>(api.query.auctions.auctionCounter);
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
