// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React from 'react';

import { FormatBalance } from '@polkadot/react-query';

export interface Props {
  children?: React.ReactNode;
  className?: string;
  colSpan?: number;
  label?: React.ReactNode;
  labelPost?: React.ReactNode;
  rowSpan?: number;
  value?: BN | null;
  withLoading?: boolean;
}

function Balance ({ children, className = '', colSpan, label, labelPost, rowSpan, value, withLoading }: Props): React.ReactElement<Props> {
  return (
    <td
      className={`${className} ui--Table-Column-Balance number`}
      colSpan={colSpan}
      rowSpan={rowSpan}
    >
      {value
        ? (
          <FormatBalance
            label={label}
            labelPost={labelPost}
            value={value}
          />
        )
        : withLoading && (
          <FormatBalance
            className='--tmp'
            value={1}
          />
        )
      }
      {children}
    </td>
  );
}

export default React.memo(Balance);
