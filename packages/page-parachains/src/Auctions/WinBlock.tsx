// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber, LeasePeriodOf } from '@polkadot/types/interfaces';
import type { Winning } from './types';

import React from 'react';

import WinRange from './WinRange';

interface Props {
  auctionInfo: [LeasePeriodOf, BlockNumber];
  className?: string;
  isEven: boolean;
  isLatest: boolean;
  value: Winning;
}

function WinBlock ({ auctionInfo, className = '', isEven, isLatest, value: { blockNumber, winners } }: Props): React.ReactElement<Props> {
  return (
    <>
      {winners.map((value, index) => (
        <WinRange
          auctionInfo={auctionInfo}
          blockNumber={blockNumber}
          className={`${className} ${isEven ? 'isEven' : 'isOdd'} ${index === (winners.length - 1) ? '' : 'noBorder'}`}
          isFirst={index === 0}
          isLatest={isLatest}
          key={index}
          value={value}
        />
      ))}
    </>
  );
}

export default React.memo(WinBlock);
