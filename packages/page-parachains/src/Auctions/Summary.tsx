// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AuctionIndex, Balance, BlockNumber, LeasePeriodOf } from '@polkadot/types/interfaces';
import type { Winning } from './types';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi, useBestNumber, useCall } from '@polkadot/react-hooks';
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
  const bestNumber = useBestNumber();
  const totalIssuance = useCall<Balance>(api.query.balances?.totalIssuance);
  const [period, ending] = auctionInfo || [];

  return (
    <SummaryBox className={className}>
      <section>
        <CardSummary label={t<string>('auctions')}>
          {formatNumber(numAuctions)}
        </CardSummary>
        {period && (
          <CardSummary label={t<string>('period')}>
            {formatNumber(period)}
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
            {bestNumber && ending && (
              bestNumber.lt(ending)
                ? (
                  <CardSummary
                    label={t<string>('end period at')}
                    progress={{
                      hideGraph: true,
                      total: ending,
                      value: bestNumber,
                      withTime: true
                    }}
                  >
                    #{formatNumber(ending)}
                  </CardSummary>
                )
                : (
                  <CardSummary
                    label={t<string>('ending period')}
                    progress={{
                      total: api.consts.auctions.endingPeriod as BlockNumber,
                      value: bestNumber.sub(ending),
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
