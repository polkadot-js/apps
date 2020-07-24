// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { UInt } from '@polkadot/types';
import { bnToBn, isBn, isUndefined } from '@polkadot/util';

interface Props {
  className?: string;
  percent?: BN | number;
  total?: UInt | BN | number;
  value?: UInt | BN | number;
}

function Progress ({ className = '', percent, total, value }: Props): React.ReactElement<Props> | null {
  const _total = bnToBn(total);
  const _value = bnToBn(value);
  const width = _total.gtn(0)
    ? (100.0 * _value.toNumber() / _total.toNumber())
    : isBn(percent)
      ? percent.toNumber()
      : percent;

  if (isUndefined(width) || width < 0) {
    return null;
  }

  const angle = width * 360 / 100;
  const firstHalfAngle = angle <= 180
    ? angle
    : 180;
  const secondHalfAngle = angle <= 180
    ? 0
    : angle - 180;

  return (
    <div className={`ui--Progress ${className}`}>
      <div className='clip'>
        <div
          className='ui--highlight--bg'
          style={{ transform: `rotate(${firstHalfAngle}deg)` }}
        />
      </div>
      <div className='clip'>
        <div
          className='ui--highlight--bg'
          style={{ transform: `rotate(${secondHalfAngle}deg)` }}
        />
      </div>
      <div className='inner'>
        <div>{width.toFixed(1)}%</div>
      </div>
    </div>
  );
}

export default React.memo(styled(Progress)`
  background: rgba(0, 0, 0, 0.05);
  border-radius: 100%;
  height: 4.5rem;
  position: relative;
  width: 4.5rem;

  .clip {
    bottom: 0;
    clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);
    left: 0;
    position: absolute;
    right: 0;
    top: 0;

    div {
      border-radius: 100%;
      bottom: 0;
      clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);
      left: 0;
      position: absolute;
      right: 0;
      transform: rotate(0);
      top: 0;
      zoom: 1;
    }
  }

  .clip+.clip {
    clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);

    div {
      clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);
    }
  }

  .inner {
    align-items: center;
    background: rgba(245, 244, 243, 87.5%);
    border-radius: 100%;
    bottom: 0.375rem;
    display: flex;
    justify-content: center;
    left: 0.375rem;
    position: absolute;
    right: 0.375rem;
    top: 0.375rem;

    div {
      line-height: 1;
      font-family: sans-serif;
      font-size: 1rem;
      font-weight: 500;
    }
  }
`);
