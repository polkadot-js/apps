// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { useBlockTime } from '@polkadot/react-hooks';

interface Props {
  className?: string;
  currBlocks: BN;
  maxBlocks: BN;
}

function BlockToTime ({ className = '', currBlocks, maxBlocks }: Props): React.ReactElement<Props> | null {
  const [,, blkInfo] = useBlockTime(maxBlocks.sub(currBlocks));
  const [,, maxInfo] = useBlockTime(maxBlocks);

  const maxCount = [maxInfo.days, maxInfo.hours, maxInfo.minutes, maxInfo.seconds]
    .reduce((final: number[], value): number[] => {
      if (final.length || value) {
        final.push(value);
      }

      return final;
    }, [])
    .length;

  return (
    <div className={className}>
      {[blkInfo.days, blkInfo.hours, blkInfo.minutes, blkInfo.seconds]
        .slice(-1 * maxCount)
        .map((value) => `00${value}`.slice(-2).split(''))
        .map((digits, index) => (
          <div key={index}>
            {index > 0 && <div className='sep'>:</div>}
            {digits.map((digit, index) => (
              <div
                className={`digit${digit === '0' ? ' isZero' : ''}`}
                key={index}
              >
                {digit}
              </div>
            ))}
          </div>
        ))
      }
    </div>
  );
}

export default React.memo(styled(BlockToTime)`
  div {
    display: inline-block;
  }

  div.digit {
    text-align: center;
    width: 1.1ch;

    &.isZero {
      opacity: 0.5;
    }
  }

  div.sep {
    font-size: 0.85em;
    opacity: 0.75;
  }
`);
