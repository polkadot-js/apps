// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Link } from 'react-router-dom';
import { HeaderExtended } from '@polkadot/api-derive';
import { AddressMini } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

interface Props {
  value: HeaderExtended;
}

function BlockHeader ({ value }: Props): React.ReactElement<Props> | null {
  if (!value) {
    return null;
  }

  const hashHex = value.hash.toHex();

  return (
    <tr>
      <td className='number'>
        <h2><Link to={`/explorer/query/${hashHex}`}>{formatNumber(value.number)}</Link></h2>
      </td>
      <td className='all hash overflow'>{hashHex}</td>
      <td className='address'>
        {value.author && (
          <AddressMini value={value.author} />
        )}
      </td>
    </tr>
  );
}

export default React.memo(BlockHeader);
