// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber } from '@polkadot/types/interfaces';
import type { WinnerData } from './types';

import React from 'react';

import { AddressMini, ParaLink } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

interface Props {
  blockNumber: BlockNumber;
  className?: string;
  duration: BlockNumber;
  isEven: boolean;
  isFirst: boolean;
  value: WinnerData;
}

function WinRanges ({ blockNumber, className = '', duration, isEven, isFirst, value: { accountId, paraId, range, value } }: Props): React.ReactElement<Props> {
  return (
    <tr className={`${className} ${isEven ? 'isEven' : 'isOdd'}`}>
      <td>{isFirst && <h1>{formatNumber(blockNumber)}/{formatNumber(duration)}</h1>}</td>
      <td className='number'><h1>{formatNumber(paraId)}</h1></td>
      <td><ParaLink id={paraId} /></td>
      <td className='address'><AddressMini value={accountId} /></td>
      <td>{range}</td>
      <td className='number'><FormatBalance value={value} /></td>
    </tr>
  );
}

export default React.memo(WinRanges);
