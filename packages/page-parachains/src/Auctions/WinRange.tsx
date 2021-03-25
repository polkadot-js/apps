// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { AuctionInfo } from '../types';
import type { WinnerData } from './types';

import React from 'react';

import { AddressMini, Digits, ParaLink } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  auctionInfo: AuctionInfo;
  blockNumber: BN;
  className?: string;
  isFirst: boolean;
  isLatest: boolean;
  value: WinnerData;
}

function WinRanges ({ auctionInfo, blockNumber, className = '', isFirst, isLatest, value: { accountId, paraId, range, value } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <tr className={className}>
      <td>
        {isFirst && (
          <h1>{isLatest
            ? t<string>('latest')
            : <>#{formatNumber(blockNumber.isZero() ? auctionInfo.endBlock : blockNumber)}</>
          }</h1>
        )}
      </td>
      <td className='number'><h1>{formatNumber(paraId)}</h1></td>
      <td className='badge'><ParaLink id={paraId} /></td>
      <td className='address'><AddressMini value={accountId} /></td>
      <td className='all number'>{auctionInfo.leasePeriod && (
        <Digits value={`${formatNumber(auctionInfo.leasePeriod.addn(range[0]))} - ${formatNumber(auctionInfo.leasePeriod.addn(range[1]))}`} />
      )}</td>
      <td className='number'><FormatBalance value={value} /></td>
    </tr>
  );
}

export default React.memo(WinRanges);
