// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Header } from '@polkadot/primitives/header';
import type { I18nProps } from '@polkadot/ui-react-app/types';

import './BlockHeader.css';

import React from 'react';
import headerHash from '@polkadot/primitives-codec/header/hash';
import u8aToHex from '@polkadot/util/u8a/toHex';

import translate from '../translate';

type Props = I18nProps & {
  label?: string,
  value?: Header
};

function BlockHeader ({ className, label = '#', value, style }: Props): React$Node {
  if (!value) {
    return null;
  }

  const hash = headerHash(value);
  const { extrinsicsRoot, number, parentHash, stateRoot } = value;

  return (
    <div
      className={['explorer--BlockHeader', className].join(' ')}
      style={style}
    >
      <div className='number'>
        <div>{label}{number.toString()}</div>
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

export default translate(BlockHeader);
