// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Link } from 'react-router-dom';
import { HeaderExtended } from '@polkadot/api-derive';
import { AddressMini } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';
import { FormatBalance } from '@polkadot/react-query';

interface Props {
  value: HeaderExtended,
}

function Account ({ value }: Props): React.ReactElement<Props> | null {
  if (!value) {
    return null;
  }

  return (
    <tr>
      <td className='address'>
        {value.account && (
          <AddressMini value={value.account} />
        )}
      </td>
      <td className='number'>
        {value.free_balance && (
          <FormatBalance value={value.free_balance} />
        )}
      </td>
      <td className='number'>
        {value.locked_balance && (
          <FormatBalance value={value.locked_balance} />
        )}
      </td>
      <td className='number'>
        {value.available_balance && (
          <FormatBalance value={value.available_balance} />
        )}
      </td>
      <td className='number'>
        {value.locked_reward !== undefined && (
          <FormatBalance value={value.locked_reward} />
        )}
      </td>
      <td className='number'>
        {value.unlocked_reward !== undefined && (
          <FormatBalance value={value.unlocked_reward} />
        )}
      </td>
      <td className='number'>
        {value.nonce && `${value.nonce} txs`}
      </td>
      <td className='number'>
        {value.produced_blocks !== undefined && `${value.produced_blocks} blocks`}
      </td>
    </tr>
  );
}

export default React.memo(Account);
