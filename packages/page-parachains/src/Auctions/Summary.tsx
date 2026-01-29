// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u32 } from '@polkadot/types';
import type { Balance, BlockNumber } from '@polkadot/types/interfaces';
import type { AuctionInfo, Winning } from '../types.js';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi, useBestNumber, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN_ONE, formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  auctionInfo?: AuctionInfo;
  className?: string;
  lastWinners?: Winning;
}

function Summary ({ auctionInfo, className, lastWinners }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useBestNumber();
  const totalIssuance = useCall<Balance>(api.query.balances?.totalIssuance);

  return (
    <SummaryBox className={className}>
      <section>
        <CardSummary label={t('auctions')}>
          {auctionInfo
            ? formatNumber(auctionInfo.numAuctions)
            : <span className='--tmp'>99</span>}
        </CardSummary>
        <CardSummary label={t('active')}>
          {auctionInfo
            ? auctionInfo.leasePeriod
              ? t('yes')
              : t('no')
            : <span className='--tmp'>{t('no')}</span>
          }
        </CardSummary>
      </section>
      {auctionInfo && (
        <>
          <section>
            {auctionInfo.leasePeriod && (
              <CardSummary label={t('first - last')}>
                {formatNumber(auctionInfo.leasePeriod)} - {formatNumber(auctionInfo.leasePeriod.add(api.consts.auctions.leasePeriodsPerSlot as u32).isub(BN_ONE))}
              </CardSummary>
            )}
            {totalIssuance && lastWinners && (
              <CardSummary
                label={t('total')}
                progress={{
                  hideValue: true,
                  total: totalIssuance,
                  value: lastWinners.total,
                  withTime: true
                }}
              >
                <FormatBalance
                  value={lastWinners.total}
                  withSi
                />
              </CardSummary>
            )}
          </section>
          <section>
            {auctionInfo?.endBlock && bestNumber && (
              bestNumber.lt(auctionInfo.endBlock)
                ? (
                  <CardSummary
                    label={t('end period at')}
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
                    label={t('ending period')}
                    progress={{
                      total: api.consts.auctions?.endingPeriod as BlockNumber,
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
