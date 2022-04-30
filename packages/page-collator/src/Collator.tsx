// Copyright 2017-2022 @polkadot/app-collator authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Collator as CollatorType } from './types';

import React from 'react';

import { AddressSmall, Badge } from '@polkadot/react-components';
import { BalanceFree, FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

interface Props {
  className?: string;
  info: CollatorType;
}

function Collator ({ className, info: { accountId, deposit, isInvulnerable, lastBlock } }: Props): React.ReactElement<Props> {
  return (
    <tr className={className}>
      <td className='badge number'>
        {isInvulnerable && (
          <Badge
            color='green'
            icon='vector-square'
          />
        )}
      </td>
      <td className='address'>
        <AddressSmall value={accountId} />
      </td>
      <td className='number'>
        {deposit && (
          <FormatBalance value={deposit} />
        )}
      </td>
      <td className='number'>
        <BalanceFree params={accountId} />
      </td>
      <td className='number'>
        {lastBlock && formatNumber(lastBlock)}
      </td>
    </tr>
  );
}

export default React.memo(Collator);
