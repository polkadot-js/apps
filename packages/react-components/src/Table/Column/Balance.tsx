// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React from 'react';

import { FormatBalance } from '@polkadot/react-query';

export interface Props {
  className?: string;
  colSpan?: number;
  rowSpan?: number;
  value?: BN | null;
  withLoading?: boolean;
}

function Balance ({ className = '', colSpan, rowSpan, value, withLoading }: Props): React.ReactElement<Props> {
  return (
    <td
      className={`${className} ui--Table-Column-Balance number`}
      colSpan={colSpan}
      rowSpan={rowSpan}
    >
      {value
        ? <FormatBalance value={value} />
        : withLoading && (
          <FormatBalance
            className='tmp'
            value={1}
          />
        )
      }
    </td>
  );
}

export default React.memo(Balance);
