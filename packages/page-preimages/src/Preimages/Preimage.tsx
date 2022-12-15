// Copyright 2017-2022 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';

import React from 'react';

import { formatNumber } from '@polkadot/util';

import usePreimage from '../usePreimage';
import Call from './Call';
import Hash from './Hash';

interface Props {
  className?: string;
  value: HexString;
}

function Preimage ({ className, value }: Props): React.ReactElement<Props> {
  const info = usePreimage(value);

  return (
    <tr className={ className }>
      <Hash value={value} />
      <Call value={info} />
      <td className='number'>
        {info?.bytes && formatNumber(info.bytes.length)}
      </td>
      <td className='number'>
        {info?.status?.type}
      </td>
      <td className='number'>
        {info && info.count !== 0 && formatNumber(info.count)}
      </td>
    </tr>
  );
}

export default React.memo(Preimage);
