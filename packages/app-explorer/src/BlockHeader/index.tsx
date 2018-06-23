// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Header } from '@polkadot/primitives/header';
import { I18nProps } from '@polkadot/ui-app/types';

import './BlockHeader.css';

import React from 'react';

import headerHash from '@polkadot/primitives-codec/header/hash';
import classes from '@polkadot/ui-app/util/classes';
import numberFormat from '@polkadot/ui-react-rx/util/numberFormat';
import u8aToHex from '@polkadot/util/u8a/toHex';

import translate from '../translate';

type Props = I18nProps & {
  value?: Header
};

function BlockHeader ({ className, value, style }: Props) {
  if (!value) {
    return null;
  }

  const hash = headerHash(value);
  const { extrinsicsRoot, number, parentHash, stateRoot } = value;

  return (
    <div
      className={classes('explorer--BlockHeader', className)}
      style={style}
    >
      <div className='number'>
        <div>{numberFormat(number)}</div>
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
