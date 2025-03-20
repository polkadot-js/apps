// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Link } from 'react-router-dom';

import { formatNumber } from '@polkadot/util';
import type { Header } from '@polkadot/types/interfaces';

import { useBlockAuthor } from '@polkadot/react-hooks/useBlockAuthor';
import { AddressSmall } from '@polkadot/react-components';

interface Props {
  value: Header;
}

function BlockHeader({ value }: Props): React.ReactElement<Props> | null {
  let author = useBlockAuthor(value)

  if (!value) {
    return null;
  }

  const hashHex = value.hash.toHex();

  const authorHuman = author?.toHuman();

  return (
    <tr>
      <td className='number'>
        <h4 className='--digits'>
          <Link to={`/explorer/query/${hashHex}`}>{formatNumber(value.number)}</Link>
        </h4>
      </td>
      <td className='all hash overflow'>{hashHex}</td>
      <td className='address' >
        {!!authorHuman && <AddressSmall value={author} />}
      </td>
    </tr>
  );
}

export default React.memo(BlockHeader);
