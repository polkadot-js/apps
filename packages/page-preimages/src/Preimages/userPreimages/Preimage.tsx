// Copyright 2017-2025 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Preimage as TPreimage } from '@polkadot/react-hooks/types';

import React from 'react';

import { AddressMini } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import Call from '../Call.js';
import Hash from '../Hash.js';

interface Props {
  className?: string;
  depositor: string,
  preimageInfos: TPreimage[];
}

const Preimage = ({ className, depositor, preimageInfos }: Props) => {
  return (
    <>
      {preimageInfos.map((info, index) => {
        return (
          <tr
            className={className}
            key={info.proposalHash}
          >
            <td
              className='address all'
              style={{ paddingTop: 15, verticalAlign: 'top' }}
            >
              {index === 0 && <AddressMini value={depositor} />}
            </td>
            <Call value={info} />
            <Hash value={info.proposalHash} />
            <td className='number media--1000'>
              {info?.proposalLength
                ? formatNumber(info.proposalLength)
                : <span className='--tmp'>999,999</span>}
            </td>
            <td className='preimageStatus start media--1100 together'>
              {info
                ? (
                  <>
                    {info.status && (<div>{info.status?.type}{info.count !== 0 && <>&nbsp;/&nbsp;{formatNumber(info.count)}</>}</div>)}
                  </>
                )
                : <span className='--tmp'>Unrequested</span>}
            </td>
          </tr>
        );
      })}
    </>
  );
};

export default React.memo(Preimage);
