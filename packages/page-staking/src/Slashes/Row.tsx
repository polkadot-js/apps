// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Slash } from './types';

import React from 'react';
import { AddressMini, AddressSmall } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

interface Props {
  slash: Slash;
  withEra: boolean;
}

function Row ({ slash: { era, slash: { others, own, payout, reporters, validator }, total }, withEra }: Props): React.ReactElement<Props> {
  return (
    <tr>
      <td className='number'>
        <h1>{withEra && formatNumber(era)}</h1>
      </td>
      <td className='address'>
        <AddressSmall value={validator} />
      </td>
      <td className='number together'>
        <FormatBalance value={own} />
      </td>
      <td className='number together'>
        <FormatBalance value={total} />
      </td>
      <td className='address all'>
        {others.map(([accountId, balance], index): React.ReactNode => (
          <AddressMini
            balance={balance}
            key={index}
            value={accountId}
            withBalance
          />
        ))}
      </td>
      <td className='address'>
        {reporters.map((reporter, index): React.ReactNode => (
          <AddressMini
            key={index}
            value={reporter}
          />
        ))}
      </td>
      <td className='number together'>
        <FormatBalance value={payout} />
      </td>
    </tr>
  );
}

export default React.memo(Row);
