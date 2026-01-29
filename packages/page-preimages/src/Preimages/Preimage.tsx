// Copyright 2017-2025 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Preimage as TPreimage } from '@polkadot/react-hooks/types';
import type { HexString } from '@polkadot/util/types';

import React, { useEffect } from 'react';

import { usePreimage } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import Call from './Call.js';
import Free from './Free.js';
import Hash from './Hash.js';

interface Props {
  className?: string;
  value: HexString;
  cb?: (info: TPreimage) => void;
}

function Preimage ({ cb, className, value }: Props): React.ReactElement<Props> {
  const info = usePreimage(value);

  useEffect(() => {
    info && cb?.(info);
  }, [cb, info]);

  return (
    <tr className={className}>
      <Hash value={value} />
      <Call value={info} />
      <td className='number media--1000'>
        {info?.proposalLength
          ? formatNumber(info.proposalLength)
          : <span className='--tmp'>999,999</span>}
      </td>
      <td className='preimageStatus together media--1200'>
        {info
          ? (
            <>
              {info.status && (<div>{info.status?.type}{info.count !== 0 && <>&nbsp;/&nbsp;{formatNumber(info.count)}</>}</div>)}
              <Free value={info} />
            </>
          )
          : <span className='--tmp'>Unrequested</span>}
      </td>
    </tr>
  );
}

export default React.memo(Preimage);
