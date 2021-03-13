// Copyright 2017-2021 @polkadot/app-auctions authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AuctionIndex, Balance, BlockNumber, LeasePeriodOf } from '@polkadot/types/interfaces';
import type { Winning } from './types';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  auctionInfo: [LeasePeriodOf, BlockNumber] | null;
  className?: string;
  lastWinner: Winning | null;
  numAuctions?: AuctionIndex | null;
}

function Summary ({ auctionInfo, className, lastWinner, numAuctions }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber);
  const totalIssuance = useCall<Balance>(api.query.balances?.totalIssuance);
  const [period, ending] = auctionInfo || [];

  return (
    <SummaryBox className={className}>
      <CardSummary label={t<string>('auctions')}>
        {formatNumber(numAuctions)}
      </CardSummary>
      {auctionInfo && (
        <>
          {totalIssuance && lastWinner && (
            <CardSummary
              label={t<string>('total')}
              progress={{
                hideValue: true,
                total: totalIssuance,
                value: lastWinner.total,
                withTime: true
              }}
            >
              <FormatBalance
                value={lastWinner.total}
                withSi
              />
            </CardSummary>
          )}
          <section>
            <CardSummary label={t<string>('period')}>
              {formatNumber(period)}
            </CardSummary>
            <CardSummary
              label={
                bestNumber && ending && bestNumber.gt(ending)
                  ? t<string>('ended at')
                  : t<string>('ends at')
              }
              progress={{
                hideGraph: true,
                total: ending,
                value: bestNumber,
                withTime: true
              }}
            >
              #{formatNumber(ending)}
            </CardSummary>
          </section>
        </>
      )}
    </SummaryBox>
  );
}

export default React.memo(Summary);
