// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { UInt } from '@polkadot/types';
import { bnToBn } from '@polkadot/util';

interface Props {
  className?: string;
  isDisabled?: boolean;
  total?: UInt | BN | number | null;
  value?: UInt | BN | number | null;
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

function Progress ({ className = '', isDisabled, total, value }: Props): React.ReactElement<Props> | null {
  const _total = bnToBn(total || 0);
  const angle = _total.gtn(0)
    ? (bnToBn(value || 0).muln(36000).div(_total).toNumber() / 100)
    : 0;

  if (angle < 0) {
    return null;
  }

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
        <div>{Math.floor(angle * 100 / 360)}%</div>
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
      font-size: 1.25rem;
      text-shadow: 0 0 2px #f5f4f3;
    }
  }
`);
