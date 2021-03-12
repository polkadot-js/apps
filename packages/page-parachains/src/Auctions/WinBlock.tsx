// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber } from '@polkadot/types/interfaces';
import type { Winning } from './types';

import React from 'react';

import WinRange from './WinRange';

interface Props {
  className?: string;
  duration: BlockNumber;
  isEven: boolean;
  value: Winning;
}

function WinBlock ({ className, duration, isEven, value: { blockNumber, winners } }: Props): React.ReactElement<Props> {
  return (
    <>
      {winners.map((value, index) => (
        <WinRange
          blockNumber={blockNumber}
          className={className}
          duration={duration}
          isEven={isEven}
          isFirst={index === 0}
          key={index}
          value={value}
        />
      ))}
    </>
  );
}

export default React.memo(WinBlock);
