// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HeaderExtended } from '@polkadot/api-derive/types';
import type { AccountId} from '@polkadot/types/interfaces';

import React from 'react';
import { Link } from 'react-router-dom';

import { AddressMini, Digits } from '@polkadot/react-components';
import { formatNumber, u8aToHex } from '@polkadot/util';

interface Props {
  value: HeaderExtended;
}

function BlockHeader ({ value }: Props): React.ReactElement<Props> | null {
  if (!value) {
    return null;
  }

  const hashHex = value.hash.toHex();
  let authorAccountId:AccountId
  // if (value.author){
  //   authorAccountId= value.author
  // } else {
  //   let authorId=value.digest.logs[0].asConsensus[1]
  //   //console.log("authorId",authorId, u8aToHex(authorId))
  // }
  console.log("BLOCK",value.toHuman())

  return (
    <tr>
      <td className='number'>
        <h2><Link to={`/explorer/query/${hashHex}`}><Digits value={formatNumber(value.number)} /></Link></h2>
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
