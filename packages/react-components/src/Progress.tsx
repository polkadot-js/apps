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
  isDisabled?: boolean;
  percent?: BN | number;
  total?: UInt | BN | number;
  value?: UInt | BN | number;
  withSummary?: boolean;
}

interface RotateProps {
  angle: string;
  type: 'first' | 'second';
}

function DivClip ({ angle, type }: RotateProps): React.ReactElement<RotateProps> {
  return (
    <div className={`clip ${type}`}>
      <div
        className='ui--highlight--bg'
        style={{ transform: `rotate(${angle}deg)` }}
      />
    </div>
  );
}

const Clip = React.memo(DivClip);

function Progress ({ className = '', isDisabled, percent, total, value, withSummary = true }: Props): React.ReactElement<Props> | null {
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

  return (
    <div className={`ui--Progress${isDisabled ? ' isDisabled' : ''} ${className}`}>
      <div className='background ui--highlight--bg' />
      <Clip
        angle={
          angle <= 180
            ? angle.toFixed(1)
            : '180'
        }
        type='first'
      />
      <Clip
        angle={
          angle <= 180
            ? '0'
            : (angle - 180).toFixed(1)
        }
        type='second'
      />
      <div className='inner'>
        {withSummary && <div>{width.toFixed(1)}%</div>}
      </div>
    </div>
  );
}

export default React.memo(styled(Progress)`
  border-radius: 100%;
  clip-path: circle(50%);
  height: 4.5rem;
  position: relative;
  width: 4.5rem;

  &.isDisabled {
    filter: grayscale(100%);
    opacity: 0.25;
  }

  .background,
  .clip {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }

  .background {
    opacity: 0.125;
  }

  .clip {
    div {
      border-radius: 100%;
      bottom: 0;
      left: 0;
      position: absolute;
      right: 0;
      transform: rotate(0);
      top: 0;
      zoom: 1;
    }
  }

  .clip.first {
    clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);

    div {
      clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);
    }
  }

  .clip.second {
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
