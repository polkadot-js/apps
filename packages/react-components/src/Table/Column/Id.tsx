// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React from 'react';

import { formatNumber } from '@polkadot/util';

import { styled } from '../../styled.js';

export interface Props {
  children?: React.ReactNode;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
  value: BN | number;
}

function Id ({ children, className = '', colSpan, rowSpan, value }: Props): React.ReactElement<Props> {
  return (
    <StyledTd
      className={`${className} ui--Table-Column-Id`}
      colSpan={colSpan}
      rowSpan={rowSpan}
    >
      <h2 className='--digits'>{formatNumber(value)}</h2>
      {children}
    </StyledTd>
  );
}

// We want 5.5ch (which should be ok-ish for 5 decimals, i.e. 99,999), however
// we wrap the display in an h2 with max size text at ~1.3rem, so multiply it out
const WIDTH = `${(5.5 * 1.3).toFixed(3)}ch`;

const StyledTd = styled.td`
  && {
    box-sizing: content-box;
    min-width: ${WIDTH};
    text-align: right;
    white-space: nowrap;
    width: ${WIDTH};
`;

export default React.memo(Id);
