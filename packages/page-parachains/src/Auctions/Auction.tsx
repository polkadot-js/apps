// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AuctionIndex, BlockNumber, LeasePeriodOf } from '@polkadot/types/interfaces';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import useWinningData from './useWinningData';
import WinBlock from './WinBlock';

interface Props {
  auctionInfo: [LeasePeriodOf, BlockNumber] | null;
  className?: string;
  numAuctions: AuctionIndex | null;
}

function Auction ({ auctionInfo, className, numAuctions }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const winningData = useWinningData(auctionInfo);

  const headerRef = useRef([
    [t('winners'), 'start', 4],
    [t('range'), 'start'],
    [t('value'), 'number']
  ]);

  return (
    <Table
      className={className}
      empty={numAuctions && winningData && (
        auctionInfo && !winningData.length
          ? t<string>('No winners in this auction')
          : t<string>('No ongoing auction')
      )}
      header={headerRef.current}
    >
      {winningData?.map((value, count) => (
        <WinBlock
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
