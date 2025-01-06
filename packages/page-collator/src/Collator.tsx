// Copyright 2017-2025 @polkadot/app-collator authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Collator as CollatorType } from './types.js';

import React, { useMemo } from 'react';

import { AddressSmall, Badge, Table } from '@polkadot/react-components';
import { BalanceFree } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

interface Props {
  className?: string;
  info: CollatorType;
  lastBlock?: string;
}

function Collator ({ className, info: { accountId, deposit, isInvulnerable, lastBlock: lastStateBlock }, lastBlock: lastGlobalBlock }: Props): React.ReactElement<Props> {
  const lastBlock = useMemo(
    () => lastStateBlock
      ? formatNumber(lastStateBlock)
      : lastGlobalBlock,
    [lastStateBlock, lastGlobalBlock]
  );

  return (
    <tr className={className}>
      <td className='badge number'>
        {isInvulnerable && (
          <Badge
            color='green'
            icon='shield'
          />
        )}
      </td>
      <td className='address all'>
        <AddressSmall value={accountId} />
      </td>
      <Table.Column.Balance value={deposit} />
      <td className='number'>
        <BalanceFree params={accountId} />
      </td>
      <td className='number'>
        {lastBlock}
      </td>
    </tr>
  );
}

export default React.memo(Collator);
