// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber } from '@polkadot/types/interfaces';
import type { WinnerData } from './types';

import React from 'react';

import { AddressMini, ParaLink } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  blockNumber: BlockNumber;
  className?: string;
  isFirst: boolean;
  latestBlockNumber: BlockNumber;
  value: WinnerData;
}

function WinRanges ({ blockNumber, className = '', isFirst, latestBlockNumber, value: { accountId, paraId, range, value } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <tr className={className}>
      <td>
        {isFirst && (
          <h1>
            {blockNumber.eq(latestBlockNumber)
              ? t<string>('latest')
              : <>-{formatNumber(latestBlockNumber.sub(blockNumber))}</>
            }
          </h1>
        )}
      </td>
      <td className='number'><h1>{formatNumber(paraId)}</h1></td>
      <td><ParaLink id={paraId} /></td>
      <td className='address'><AddressMini value={accountId} /></td>
      <td>{range}</td>
      <td className='number'><FormatBalance value={value} /></td>
    </tr>
  );
}

export default React.memo(WinRanges);
