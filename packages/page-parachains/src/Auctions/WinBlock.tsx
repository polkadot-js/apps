// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { BlockNumber } from '@polkadot/types/interfaces';
import type { Winning } from './types';

import React from 'react';

import WinRange from './WinRange';

interface Props {
  bestNumber: BlockNumber;
  className?: string;
  isEven: boolean;
  isLatest: boolean;
  offset: BN;
  value: Winning;
}

function WinBlock ({ bestNumber, className = '', isEven, isLatest, offset, value: { blockNumber, winners } }: Props): React.ReactElement<Props> {
  return (
    <>
      {winners.map((value, index) => (
        <WinRange
          bestNumber={bestNumber}
          blockNumber={blockNumber}
          className={`${className} ${isEven ? 'isEven' : 'isOdd'} ${index === (winners.length - 1) ? '' : 'noBorder'}`}
          isFirst={index === 0}
          isLatest={isLatest}
          key={index}
          offset={offset}
          value={value}
        />
      ))}
    </>
  );
}

export default React.memo(WinBlock);
