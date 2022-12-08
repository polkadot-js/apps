// Copyright 2017-2022 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HeaderExtended } from '@polkadot/api-derive/types';

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { AddressMini, Digits, Icon } from '@polkadot/react-components';
import { BlockNumber } from '@polkadot/types/interfaces';
import { formatNumber } from '@polkadot/util';

interface Props {
  value: HeaderExtended;
  bestNumberFinalized?: BlockNumber;
}

function BlockHeader ({ bestNumberFinalized, value }: Props): React.ReactElement<Props> | null {
  const isFinalized = useMemo(() => {
    return bestNumberFinalized && bestNumberFinalized.toNumber() >= value.number.toNumber();
  },
  [bestNumberFinalized, value]
  );

  if (!value) {
    return null;
  }

  const hashHex = value.hash.toHex();

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
