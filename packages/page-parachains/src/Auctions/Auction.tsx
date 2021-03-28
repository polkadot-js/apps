// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId } from '@polkadot/types/interfaces';
import type { AuctionInfo, Campaigns, WinnerData, Winning } from '../types';

import React, { useCallback, useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

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
  const { api } = useApi();
  const newRaise = useCall<ParaId[]>(api.query.crowdloan.newRaise);

  const headerRef = useRef([
    [t('bids'), 'start', 3],
    [t('bidder'), 'address'],
    [t('crowdloan')],
    [t('periods')],
    [t('value')]
  ]);

  const interleave = useCallback(
    (winners: WinnerData[], newRaise: ParaId[], asIs: boolean): WinnerData[] => {
      if (asIs) {
        return winners;
      }

      const sorted = (campaigns.funds || [])
        .filter(({ paraId }) => newRaise.some((n) => n.eq(paraId)))
        .sort((a, b) => b.value.cmp(a.value));

      return winners.map((w): WinnerData =>
        sorted.find(({ firstSlot, lastSlot, value }) =>
          w.firstSlot.eq(firstSlot) &&
          w.lastSlot.eq(lastSlot) &&
          w.value.lt(value)
        ) || w
      );
    },
    [campaigns]
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
      {auctionInfo && newRaise && winningData?.map(({ blockNumber, winners }, round) => (
        <tbody key={round}>
          {interleave(winners, newRaise, round !== 0 || winningData.length !== 1).map((value, index) => (
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
