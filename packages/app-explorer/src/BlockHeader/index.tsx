// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Header } from '@polkadot/types';
import { BareProps } from '@polkadot/ui-app/types';

import './BlockHeader.css';

import React from 'react';
import { Link } from 'react-router-dom';
import numberFormat from '@polkadot/ui-react-rx/util/numberFormat';
import { u8aToHex } from '@polkadot/util';

import Extrinsics from './Extrinsics';

type Props = BareProps & {
  value?: Header,
  withExtrinsics?: boolean,
  withLink?: boolean
};

export default class BlockHeader extends React.PureComponent<Props> {
  render () {
    const { value, withExtrinsics = false, withLink = false } = this.props;

    if (!value) {
      return null;
    }

    const hashHex = u8aToHex(value.hash.toU8a(), 96);
    const parentHex = u8aToHex(value.parentHash.toU8a(), 64);

    return (
      <div className='explorer--BlockHeader'>
        <div className='number'>
          <div>{numberFormat(value.blockNumber.toBn())}</div>
        </div>
        <div className='details'>
          <div className='hash'>{
            withLink
              ? <Link to={`/explorer/hash/${value.hash.toHex()}`}>{hashHex}</Link>
              : hashHex
          }</div>
          <table className='contains'>
            <tbody>
              <tr>
                <td className='type'>parentHash</td>
                <td className='hash'>{
                  value.blockNumber.gt(1)
                    ? <Link to={`/explorer/hash/${value.parentHash.toHex()}`}>{parentHex}</Link>
                    : parentHex
                }</td>
              </tr>
              <tr>
                <td className='type'>extrinsicsRoot</td>
                <td className='hash'>{u8aToHex(value.extrinsicsRoot.toU8a(), 64)}</td>
              </tr>
              <tr>
                <td className='type'>stateRoot</td>
                <td className='hash'>{u8aToHex(value.stateRoot.toU8a(), 64)}</td>
              </tr>
              {withExtrinsics
                ? <Extrinsics hash={value.hash} />
                : undefined
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
