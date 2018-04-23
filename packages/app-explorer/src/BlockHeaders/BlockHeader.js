// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import React from 'react';
import u8aToHex from '@polkadot/util/u8a/toHex';

export default function BlockHeader ({ className, hash, header: { extrinsicsRoot, number, parentHash, stateRoot }, style }: any) {
  return (
    <div
      className={['explorer--BlockHeaders-BlockHeader', className].join(' ')}
      style={style}
    >
      <div className='number'>
        <div>#{number.toString()}</div>
      </div>
      <div className='details'>
        <div className='hash'>
          {u8aToHex(hash)}
        </div>
        <table className='contains'>
          <tbody>
            <tr>
              <td className='type'>parentHash</td>
              <td className='hash'>
                {u8aToHex(parentHash)}
              </td>
            </tr>
            <tr>
              <td className='type'>extrinsicsRoot</td>
              <td className='hash'>
                {u8aToHex(extrinsicsRoot)}
              </td>
            </tr>
            <tr>
              <td className='type'>stateRoot</td>
              <td className='hash'>
                {u8aToHex(stateRoot)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
