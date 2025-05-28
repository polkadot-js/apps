// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {HeaderExtended} from '@polkadot/api-derive/types';

import React from 'react';
import {Link} from 'react-router-dom';

import {AddressSmall} from '@polkadot/react-components';
import {useBlockAuthor} from '@polkadot/react-hooks/useBlockAuthor';
import {formatNumber} from '@polkadot/util';

interface Props {
  value: HeaderExtended;
}

function BlockHeader({value}: Props): React.ReactElement<Props> | null {
  const author = useBlockAuthor(value);

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
      <td className='all hash overflow'>
        {hashHex}</td>
      {/* TODO Find issue with block author address and uncomment it */}
      {/* {!!author &&
        <td className='address'>
          <AddressSmall value={author}/>
        </td>
      } */}
    </tr>
  );
}

export default React.memo(BlockHeader);
