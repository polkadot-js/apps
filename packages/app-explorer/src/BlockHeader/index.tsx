// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Header } from '@polkadot/primitives/header';
import { I18nProps } from '@polkadot/ui-app/types';

import './BlockHeader.css';

import React from 'react';
import { Link } from 'react-router-dom';
import headerHash from '@polkadot/primitives/codec/header/hash';
import classes from '@polkadot/ui-app/util/classes';
import numberFormat from '@polkadot/ui-react-rx/util/numberFormat';
import u8aToHex from '@polkadot/util/u8a/toHex';

import translate from '../translate';

// NOTE This add unneeded load, for now just on click-through
import Extrinsics from './Extrinsics';
// <Extrinsics hash={hash} />

type Props = I18nProps & {
  value?: Header,
  withExtrinsics?: boolean,
  withLink?: boolean
};

class BlockHeader extends React.PureComponent<Props> {
  render () {
    const { className, value, style, withExtrinsics = false, withLink = false } = this.props;

    if (!value) {
      return null;
    }

    const hash = headerHash(value);
    // tslint:disable-next-line:variable-name
    const { extrinsicsRoot, number, parentHash, stateRoot } = value;
    const hashHex = u8aToHex(hash);
    const linkable = withLink
      ? <Link to={`/explorer/hash/${hashHex}`}>{hashHex}</Link>
      : hashHex;

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
            {linkable}
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
              {withExtrinsics
                ? <Extrinsics hash={hash} />
                : undefined
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default translate(BlockHeader);
