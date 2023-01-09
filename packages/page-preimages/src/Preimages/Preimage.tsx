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
  isLatest: boolean;
  value: HexString;
}

function Preimage ({ className, isLatest, value }: Props): React.ReactElement<Props> {
  const info = usePreimage(value);

  return (
    <tr className={className}>
      <Hash value={value} />
      {isLatest
        ? <Call value={info} />
        : (
          <>
            <td className='all' />
            <td className='address media--1300' />
          </>
        )}
      <td className='number media--1000'>
        {isLatest
          ? info
            ? formatNumber(info.proposalLength)
            : <span className='--tmp'>999,999</span>
          : null
        }
      </td>
      <td className='preimage-status together media--1200'>
        {isLatest
          ? info
            ? (
              <>
                {info.status && (<div>{info.status?.type}{info.count !== 0 && <>&nbsp;/&nbsp;{formatNumber(info.count)}</>}</div>)}
                <Free value={info} />
              </>
            )
            : <span className='--tmp'>Unrequested</span>
          : null
        }
      </td>
    </tr>
  );
}

export default React.memo(Preimage);
