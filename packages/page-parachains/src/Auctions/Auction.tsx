// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AuctionIndex, BlockNumber, LeasePeriodOf } from '@polkadot/types/interfaces';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import Bid from './Bid';

interface Props {
  auctionInfo: [LeasePeriodOf, BlockNumber] | null;
  className?: string;
  numAuctions: AuctionIndex | null;
}

function Auction ({ auctionInfo, className, numAuctions }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef([
    [t('auctions'), 'start', 1],
    [t('duration'), 'number'],
    [t('lease period'), 'number'],
    [t('winning'), 'number', 3],
    []
  ]);

  return (
    <Table
      className={className}
      empty={numAuctions && t<string>('No ongoing auction')}
      header={headerRef.current}
    >
      {auctionInfo && numAuctions && (
        <tr>
          <td className='number'><h1>{formatNumber(numAuctions)}</h1></td>
          <td className='number all'>{formatNumber(auctionInfo[1])}</td>
          <td className='number'>{formatNumber(auctionInfo[0])}</td>
          <td colSpan={3} />
          <td className='button'>
            <Bid id={numAuctions} />
          </td>
        </tr>
      )}
    </Table>
  );
}

export default React.memo(Auction);
