// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AuctionIndex, BlockNumber, LeasePeriodOf } from '@polkadot/types/interfaces';
import type { Winning } from './types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import WinRange from './WinRange';

interface Props {
  auctionInfo: [LeasePeriodOf, BlockNumber] | null;
  className?: string;
  numAuctions: AuctionIndex | null;
  winningData: Winning[] | null;
}

function Auction ({ auctionInfo, className, numAuctions, winningData }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef([
    [t('bids'), 'start', 4],
    [t('slots')],
    [t('value')]
  ]);

  return (
    <Table
      className={className}
      empty={
        numAuctions && winningData && (
          auctionInfo && auctionInfo[1] && !winningData.length
            ? t<string>('No winners in this auction')
            : t<string>('No ongoing auction')
        )
      }
      header={headerRef.current}
    >
      {auctionInfo && winningData?.map(({ blockNumber, winners }, round) =>
        winners.map((value, index) => (
          <WinRange
            auctionInfo={auctionInfo}
            blockNumber={blockNumber}
            className={`${(round % 2) ? 'isEven' : 'isOdd'} ${index === (winners.length - 1) ? '' : 'noBorder'}`}
            isFirst={index === 0}
            isLatest={round === 0}
            key={`${blockNumber.toString()}:${index}`}
            value={value}
          />
        ))
      )}
    </Table>
  );
}

export default React.memo(Auction);
