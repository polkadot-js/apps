// Copyright 2017-2022 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId } from '@polkadot/types/interfaces';
import type { AuctionInfo, Campaign, Campaigns, WinnerData, Winning } from '../types';

import React, { useCallback, useMemo, useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import { useLeaseRangeMax } from '../useLeaseRanges';
import WinRange from './WinRange';

interface Props {
  auctionInfo?: AuctionInfo;
  campaigns: Campaigns;
  className?: string;
  winningData?: Winning[];
}

function Auction ({ auctionInfo, campaigns, className, winningData }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const rangeMax = useLeaseRangeMax();
  const newRaise = useCall<ParaId[]>(api.query.crowdloan.newRaise);

  const headerRef = useRef([
    [t('bids'), 'start', 3],
    [t('bidder'), 'address'],
    [t('crowdloan')],
    [t('leases')],
    [t('value')]
  ]);

  const loans = useMemo(
    (): Campaign[] | undefined => {
      if (newRaise && auctionInfo && auctionInfo.leasePeriod && campaigns.funds) {
        const leasePeriodStart = auctionInfo.leasePeriod;
        const leasePeriodEnd = leasePeriodStart.add(rangeMax);

        return campaigns.funds
          .filter(({ firstSlot, isWinner, lastSlot, paraId }) =>
            !isWinner &&
            newRaise.some((n) => n.eq(paraId)) &&
            firstSlot.gte(leasePeriodStart) &&
            lastSlot.lte(leasePeriodEnd)
          )
          .sort((a, b) => b.value.cmp(a.value));
      } else {
        return undefined;
      }
    },
    [auctionInfo, campaigns, newRaise, rangeMax]
  );

  const interleave = useCallback(
    (winners: WinnerData[], asIs: boolean): WinnerData[] => {
      if (asIs || !newRaise || !auctionInfo?.leasePeriod || !loans) {
        return winners;
      }

      return winners
        .concat(...loans.filter(({ firstSlot, lastSlot, paraId, value }) =>
          !winners.some((w) =>
            w.firstSlot.eq(firstSlot) &&
            w.lastSlot.eq(lastSlot)
          ) &&
          !loans.some((e) =>
            !paraId.eq(e.paraId) &&
            firstSlot.eq(e.firstSlot) &&
            lastSlot.eq(e.lastSlot) &&
            value.lt(e.value)
          )
        ))
        .map((w): WinnerData =>
          loans.find(({ firstSlot, lastSlot, value }) =>
            w.firstSlot.eq(firstSlot) &&
            w.lastSlot.eq(lastSlot) &&
            w.value.lt(value)
          ) || w
        )
        .sort((a, b) =>
          a.firstSlot.eq(b.firstSlot)
            ? a.lastSlot.cmp(b.lastSlot)
            : a.firstSlot.cmp(b.firstSlot)
        );
    },
    [auctionInfo, loans, newRaise]
  );

  return (
    <Table
      className={className}
      empty={
        newRaise && auctionInfo && auctionInfo.numAuctions && winningData && (
          auctionInfo.endBlock && !winningData.length
            ? t<string>('No winners in this auction')
            : t<string>('No ongoing auction')
        )
      }
      header={headerRef.current}
      noBodyTag
    >
      {auctionInfo && auctionInfo.leasePeriod && winningData && loans && (
        winningData.length
          ? winningData.map(({ blockNumber, winners }, round) => (
            <tbody key={round}>
              {interleave(winners, round !== 0 || winningData.length !== 1).map((value, index) => (
                <WinRange
                  auctionInfo={auctionInfo}
                  blockNumber={blockNumber}
                  isFirst={index === 0}
                  isLatest={round === 0}
                  key={`${blockNumber.toString()}:${value.key}`}
                  value={value}
                />
              ))}
            </tbody>
          ))
          : (loans.length !== 0) && (
            <tbody key='latest-crowd'>
              {interleave([], false).map((value, index) => (
                <WinRange
                  auctionInfo={auctionInfo}
                  isFirst={index === 0}
                  isLatest
                  key={`latest-crowd:${value.key}`}
                  value={value}
                />
              ))}
            </tbody>
          )
      )}
    </Table>
  );
}

export default React.memo(Auction);
