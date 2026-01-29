// Copyright 2017-2025 @polkadot/app-gilt authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { QueueTotal } from './types.js';

import React from 'react';

import { Table } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

interface Props {
  className?: string;
  value: QueueTotal;
}

function Queue ({ className, value: { balance, index, numItems } }: Props): React.ReactElement<Props> {
  return (
    <tr className={className}>
      <Table.Column.Id value={index} />
      <td className='number all'>
        {formatNumber(numItems)}
      </td>
      <td className='all'>
        <FormatBalance value={balance} />
      </td>
    </tr>
  );
}

export default React.memo(Queue);
