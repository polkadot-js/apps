// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ColIdProps as Props } from '../types';

import React from 'react';
import styled from 'styled-components';

import { formatNumber } from '@polkadot/util';

function Id ({ className = '', value }: Props): React.ReactElement<Props> {
  return (
    <td className={`ui--Table-Column-Id ${className}`}>
      <h1 className='--digits'>{formatNumber(value)}</h1>
    </td>
  );
}

// We want 5.5ch (which should be ok-ish for 5 decimals, i.e. 99,999), however
// we wrap the display in an h1 with max size text at 1.5rem, so multiply it out
const WIDTH = `${(5.5 * 1.5).toFixed(3)}ch`;

export default React.memo(styled(Id)`
  && {
    box-sizing: content-box;
    min-width: ${WIDTH};
    text-align: right;
    white-space: nowrap;
    width: ${WIDTH};
`);
