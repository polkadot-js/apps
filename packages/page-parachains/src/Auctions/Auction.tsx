// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AuctionInfo } from '../types';
import type { Winning } from './types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import WinRange from './WinRange';

interface Props {
  auctionInfo: AuctionInfo;
  className?: string;
  winningData: Winning[] | null;
}

function Auction ({ auctionInfo, className, winningData }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef([
    [t('bids'), 'start', 4],
    [t('periods')],
    [t('value')]
  ]);

  return (
    <Table
      className={className}
      empty={
        auctionInfo.numAuctions && winningData && (
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
          {winners.map((value, index) => (
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
