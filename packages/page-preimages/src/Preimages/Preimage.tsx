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
        {info?.bytes
          ? formatNumber(info.bytes.length)
          : <span className='--placeholder'>999,999</span>
        }
      </td>
      <td className='preimage-status together media--1200'>
        {info
          ? (
            <>
              <div>{info.status?.type}{info.count !== 0 && <>&nbsp;/&nbsp;{formatNumber(info.count)}</>}</div>
              <Free value={info} />
            </>
          )
          : <span className='--placeholder'>Unrequested</span>
        }
      </td>
    </tr>
  );
}

export default React.memo(Preimage);
