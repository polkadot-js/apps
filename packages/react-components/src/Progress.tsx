// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { UInt } from '@polkadot/types';

import React from 'react';
import styled from 'styled-components';

import { bnToBn } from '@polkadot/util';

interface Props {
  className?: string;
  isDisabled?: boolean;
  total?: UInt | BN | number | null;
  value?: UInt | BN | number | null;
}

function Progress ({ className = '', isDisabled, total, value }: Props): React.ReactElement<Props> | null {
  const sqSize = 42;
  const strokeWidth = 3;

  const _total = bnToBn(total || 0);
  const angle = _total.gtn(0)
    ? ((bnToBn(value || 0).muln(36000).div(_total).toNumber() / 100)) % 360
    : 0;

  if (angle < 0) {
    return null;
  }

  const percentage = Math.floor(angle * 100 / 360);
  const radius = (sqSize - strokeWidth) / 2;
  const viewBox = `0 0 ${sqSize} ${sqSize}`;
  const dashArray = radius * Math.PI * 2;
  const dashOffset = dashArray - dashArray * percentage / 100;
  const backCircleStrokeWidth = strokeWidth / 3;

  return (
    <svg
      className={`ui--Progress${isDisabled ? ' isDisabled' : ''} ${className}`}
      height={sqSize}
      viewBox={viewBox}
      width={sqSize}
    >
      <circle
        className='circle-background'
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius + backCircleStrokeWidth}
        strokeWidth={`${backCircleStrokeWidth}px`}
      />
      <circle
        className='circle-progress'
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
        style={{
          strokeDasharray: dashArray,
          strokeDashoffset: dashOffset
        }}
        transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
      />
      <text
        className='circle-text'
        dy='.3em'
        textAnchor='middle'
        x='50%'
        y='50%'
      >
        {percentage}%
      </text>
    </svg>
  );
}

export default React.memo(styled(Progress)`
  margin-left: 0.35rem;

  &.isDisabled {
    filter: grayscale(100%);
    opacity: 0.25;
  }

  .circle-background,
  .circle-progress {
    fill: none;
  }

  .circle-background {
    stroke: var(--color-label);
  }

  .circle-progress {
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .circle-text {
    fill: var(--color-text);
    font-size: 0.857rem;
    line-height: 1.286rem;
  }
`);
