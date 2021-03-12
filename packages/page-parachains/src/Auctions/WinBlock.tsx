// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber } from '@polkadot/types/interfaces';
import type { Winning } from './types';

import React from 'react';

import WinRange from './WinRange';

interface Props {
  className?: string;
  isEven: boolean;
  latestBlockNumber: BlockNumber;
  value: Winning;
}

function WinBlock ({ className = '', isEven, latestBlockNumber, value: { blockNumber, winners } }: Props): React.ReactElement<Props> {
  return (
    <>
      {winners.map((value, index) => (
        <WinRange
          blockNumber={blockNumber}
          className={`${className} ${isEven ? 'isEven' : 'isOdd'} ${index === (winners.length - 1) ? '' : 'noBorder'}`}
          isFirst={index === 0}
          key={index}
          latestBlockNumber={latestBlockNumber}
          value={value}
        />
      ))}
    </>
  );
}

export default React.memo(WinBlock);
