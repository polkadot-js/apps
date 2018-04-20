// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import React from 'react';
import u8aToHex from '@polkadot/util/u8a/toHex';

export default function BlockHeader ({ className, hash, header: { number, parentHash }, style }: any) {
  return (
    <div
      className={['explorer--BlockHeaders-BlockHeader', className].join(' ')}
      style={style}
    >
      <div className='number'>
        {number.toString()}
      </div>
      <div className='hash'>
        {u8aToHex(hash)}
      </div>
    </div>
  );
}
