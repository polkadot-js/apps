// Copyright 2017-2023 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HeaderExtended } from '@polkadot/api-derive/types';

import React from 'react';
import { Link } from 'react-router-dom';

import { AddressSmall } from '@polkadot/react-components';
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
        <Link to={`/explorer/query/${hashHex}`}><span className='--digits'>#{formatNumber(value.number)}</span></Link>
      </td>
      <td className='all hash overflow'>{hashHex}</td>
      <td className='address'>
        {value.author && (
          <AddressSmall value={value.author} />
        )}
      </td>
    </tr>
  );
}

export default React.memo(BlockHeader);
