// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Header } from '@polkadot/primitives/header';
import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-react-rx/types';

import './BlockHeader.css';

import React from 'react';

import headerHash from '@polkadot/primitives/codec/header/hash';
import classes from '@polkadot/ui-app/util/classes';
import numberFormat from '@polkadot/ui-react-rx/util/numberFormat';
import withApi from '@polkadot/ui-react-rx/with/api';
import u8aToHex from '@polkadot/util/u8a/toHex';

import translate from '../translate';
import Extrinsics from './Extrinsics';

type Props = ApiProps & I18nProps & {
  value?: Header
};

class BlockHeader extends React.PureComponent<Props> {
  render () {
    const { className, value, style } = this.props;

    if (!value) {
      return null;
    }

    const hash = headerHash(value);
    // tslint:disable-next-line:variable-name
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
              {this.renderExtrinsics(hash)}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  private renderExtrinsics (hash: Uint8Array) {
    const { apiMethods } = this.props;

    if (!apiMethods['chain_getBlock']) {
      return null;
    }

    return (
      <Extrinsics hash={hash} />
    );
  }
}

export default withApi(
  translate(BlockHeader)
);
