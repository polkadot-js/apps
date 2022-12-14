// Copyright 2017-2022 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HeaderExtended } from '@polkadot/api-derive/types';

import React from 'react';
import { Link } from 'react-router-dom';

import { AddressMini, Digits, Icon } from '@polkadot/react-components';
import useIsFinalized from '@polkadot/react-query/useIsFinalized';
import { formatNumber } from '@polkadot/util';

interface Props {
  value: HeaderExtended;
}

function BlockHeader ({ value }: Props): React.ReactElement<Props> | null {
  const hashHex = value.hash.toHex();
  const isFinalized = useIsFinalized({ blockNumber: value.number.unwrap(), hash: hashHex });

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
      <td className='finalizedIcon'>
        {isFinalized
          ? <Icon
            className='highlight--color'
            icon='fa-solid fa-circle-check'
          />
          : null}
      </td>
    </tr>
  );
}

export default React.memo(BlockHeader);
