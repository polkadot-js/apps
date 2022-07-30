// Copyright 2017-2022 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';

import React from 'react';

import { formatNumber } from '@polkadot/util';

import useHashInfo from './useHashInfo';

interface Props {
  className?: string;
  value: HexString;
}

function Hash ({ className, value }: Props): React.ReactElement<Props> {
  const info = useHashInfo(value);

  return (
    <tr className={ className }>
      <td className='all'>
        {value}
      </td>
      <td className='number'>
        {info && info.bytes && formatNumber(info.bytes.length)}
      </td>
      <td className='number'>
        {info && info.status && info.status.type}
      </td>
    </tr>
  );
}

export default React.memo(Hash);
