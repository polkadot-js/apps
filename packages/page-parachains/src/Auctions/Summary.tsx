// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AuctionIndex, Balance, BlockNumber } from '@polkadot/types/interfaces';
import type { AuctionInfo } from '../types';
import type { Winning } from './types';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi, useBestNumber, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  auctionInfo: AuctionInfo;
  className?: string;
  lastWinner: Winning | null;
  numAuctions?: AuctionIndex | null;
}

function Summary ({ auctionInfo, className, lastWinner }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useBestNumber();
  const totalIssuance = useCall<Balance>(api.query.balances?.totalIssuance);

  return (
    <SummaryBox className={className}>
      <section>
        <CardSummary label={t<string>('auctions')}>
          {formatNumber(auctionInfo.numAuctions)}
        </CardSummary>
        {auctionInfo.leasePeriod && (
          <CardSummary label={t<string>('period')}>
            {formatNumber(auctionInfo.leasePeriod)}
          </CardSummary>
        )}
      </section>
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
            {bestNumber && auctionInfo.endBlock && (
              bestNumber.lt(auctionInfo.endBlock)
                ? (
                  <CardSummary
                    label={t<string>('end period at')}
                    progress={{
                      hideGraph: true,
                      total: auctionInfo.endBlock,
                      value: bestNumber,
                      withTime: true
                    }}
                  >
                    #{formatNumber(auctionInfo.endBlock)}
                  </CardSummary>
                )
                : (
                  <CardSummary
                    label={t<string>('ending period')}
                    progress={{
                      total: api.consts.auctions.endingPeriod as BlockNumber,
                      value: bestNumber.sub(auctionInfo.endBlock),
                      withTime: true
                    }}
                  ></CardSummary>
                )
            )}
          </section>
        </>
      )}
    </SummaryBox>
  );
}

export default React.memo(Summary);
