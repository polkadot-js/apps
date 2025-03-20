// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Link } from 'react-router-dom';

import { formatNumber } from '@polkadot/util';
import type { HeaderExtended } from '@polkadot/api-derive/types';

import { useBlockAuthor } from '@polkadot/react-hooks/useBlockAuthor';
import { AddressSmall } from '@polkadot/react-components';

interface Props {
  value: HeaderExtended;
}

function BlockHeader({ value }: Props): React.ReactElement<Props> | null {
  let author = useBlockAuthor(value)

  if (!value) {
    return null;
  }

  const hashHex = value.hash.toHex();


  return (
    <tr>
      <td className='number'>
        <h4 className='--digits'>
          <Link to={`/explorer/query/${hashHex}`}>{formatNumber(value.number)}</Link>
        </h4>
      </td>
      <td className='all hash overflow'>{hashHex}</td>
      <td className='address' >
        {!!author && <AddressSmall value={author} />}
      </td>
    </tr>
  );
}

export default React.memo(BlockHeader);
