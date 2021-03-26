// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AuctionInfo, Campaigns, WinnerData, Winning } from '../types';

import React, { useCallback, useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import WinRange from './WinRange';

interface Props {
  auctionInfo?: AuctionInfo;
  campaigns: Campaigns;
  className?: string;
  winningData?: Winning[];
}

function Auction ({ auctionInfo, campaigns, className, winningData }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef([
    [t('bids'), 'start', 3],
    [t('bidder'), 'address'],
    [t('crowdloan')],
    [t('periods')],
    [t('value')]
  ]);

  const interleave = useCallback(
    (winners: WinnerData[], asIs: boolean): WinnerData[] =>
      asIs
        ? winners
        : winners.map((w): WinnerData =>
          campaigns.funds?.find(({ firstSlot, lastSlot, value }) =>
            w.firstSlot.eq(firstSlot) &&
            w.lastSlot.eq(lastSlot) &&
            w.value.lt(value)
          ) || w
        ),
    [campaigns]
  );

  return (
    <Table
      className={className}
      empty={
        auctionInfo && auctionInfo.numAuctions && winningData && (
          auctionInfo.endBlock && !winningData.length
            ? t<string>('No winners in this auction')
            : t<string>('No ongoing auction')
        )
      }
      header={headerRef.current}
      noBodyTag
    >
      {auctionInfo && winningData?.map(({ blockNumber, winners }, round) => (
        <tbody key={round}>
          {interleave(winners, round !== 0 || winningData.length !== 1).map((value, index) => (
            <WinRange
              auctionInfo={auctionInfo}
              blockNumber={blockNumber}
              isFirst={index === 0}
              isLatest={round === 0}
              key={`${blockNumber.toString()}:${index}`}
              value={value}
            />
          ))}
        </tbody>
      ))}
    </Table>
  );
}

export default React.memo(Auction);
