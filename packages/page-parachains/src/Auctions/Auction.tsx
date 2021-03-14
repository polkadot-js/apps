// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AuctionIndex, BlockNumber, LeasePeriodOf } from '@polkadot/types/interfaces';
import type { Winning } from './types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import WinBlock from './WinBlock';

interface Props {
  auctionInfo: [LeasePeriodOf, BlockNumber] | null;
  className?: string;
  numAuctions: AuctionIndex | null;
  winningData: Winning[] | null;
}

function Auction ({ auctionInfo, className, numAuctions, winningData }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef([
    [t('winners'), 'start', 4],
    [t('slots')],
    [t('value')]
  ]);

  const endBlock = auctionInfo && auctionInfo[1];

  return (
    <Table
      className={className}
      empty={numAuctions && winningData && (
        endBlock && !winningData.length
          ? t<string>('No winners in this auction')
          : t<string>('No ongoing auction')
      )}
      header={headerRef.current}
    >
      {auctionInfo && winningData?.map((value, count) => (
        <WinBlock
          auctionInfo={auctionInfo}
          isEven={!!(count % 2)}
          isLatest={count === 0}
          key={value.blockNumber.toString()}
          value={value}
        />
      ))}
    </Table>
  );
}

export default React.memo(Auction);
