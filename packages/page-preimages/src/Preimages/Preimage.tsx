// Copyright 2017-2023 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';

import React from 'react';

import { formatNumber } from '@polkadot/util';

import usePreimage from '../usePreimage';
import Call from './Call';
import Free from './Free';
import Hash from './Hash';

interface Props {
  className?: string;
  value: HexString;
}

function Preimage ({ className, value }: Props): React.ReactElement<Props> {
  const info = usePreimage(value);

  return (
    <tr className={className}>
      <Hash value={value} />
      <Call value={info} />
      <td className='number media--1000'>
        {info?.bytes && formatNumber(info.bytes.length)}
      </td>
      <td className='preimage-status together media--1200'>
        <div>{info?.status?.type}</div>
        {info && <Free value={info} />}
      </td>
      <td className='number media--1400'>
        {info && info.count !== 0 && formatNumber(info.count)}
      </td>
    </tr>
  );
}

export default React.memo(Preimage);
