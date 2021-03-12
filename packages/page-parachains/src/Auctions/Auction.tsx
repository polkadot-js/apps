// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AuctionIndex, BlockNumber, LeasePeriodOf } from '@polkadot/types/interfaces';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../translate';
import useWinningData from './useWinningData';
import WinBlock from './WinBlock';

interface Props {
  auctionInfo: [LeasePeriodOf, BlockNumber] | null;
  bestNumber?: BlockNumber;
  className?: string;
  numAuctions: AuctionIndex | null;
}

function Auction ({ auctionInfo, bestNumber, className, numAuctions }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const winningData = useWinningData();

  const headerRef = useRef([
    [t('winners'), 'start', 4],
    [t('range'), 'start'],
    [t('value'), 'number']
  ]);

  const offset = auctionInfo && bestNumber && bestNumber.gt(auctionInfo[1])
    ? bestNumber.sub(auctionInfo[1])
    : BN_ZERO;

  return (
    <Table
      className={className}
      empty={winningData && numAuctions && auctionInfo
        ? t<string>('No winners in this auction')
        : t<string>('No ongoing auction')
      }
      header={headerRef.current}
    >
      {offset && bestNumber && winningData?.map((value, count) => (
        <WinBlock
          bestNumber={bestNumber}
          isEven={!!(count % 2)}
          isLatest={count === 0}
          key={value.blockNumber.toString()}
          offset={offset}
          value={value}
        />
      ))}
    </Table>
  );
}

export default React.memo(Auction);
