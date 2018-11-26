// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Header } from '@polkadot/primitives/header';
import { BareProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-react-rx/types';

import './BlockHeader.css';

import React from 'react';
import { Link } from 'react-router-dom';
import headerHash from '@polkadot/primitives/codec/header/hash';
import numberFormat from '@polkadot/ui-react-rx/util/numberFormat';
import withApi from '@polkadot/ui-react-rx/with/api';
import u8aToHex from '@polkadot/util/u8a/toHex';

import CopyButton from '@polkadot/ui-app/CopyButton';
import Extrinsics from './Extrinsics';

type Props = ApiProps & BareProps & {
  value?: Header,
  withExtrinsics?: boolean,
  withLink?: boolean
};

class BlockHeader extends React.PureComponent<Props> {
  render () {
    const { apiMethods, value, withExtrinsics = false, withLink = false } = this.props;

    if (!value) {
      return null;
    }

    const isLinkable = !!apiMethods.chain_getBlock;
    const hash = headerHash(value);
    // tslint:disable-next-line:variable-name
    const { extrinsicsRoot, number, parentHash, stateRoot } = value;
    const hashHex = u8aToHex(hash);
    const parentHex = u8aToHex(parentHash);

    return (
      <div className='explorer--BlockHeader'>
        <div className='number'>
          <div>{numberFormat(number)}</div>
        </div>
        <div className='details'>
          <div className='hash'>
            {isLinkable && withLink
              ? <Link to={`/explorer/hash/${hashHex}`}>{hashHex}</Link>
              : hashHex}
            <CopyButton value={hashHex} />
          </div>
          <table className='contains'>
            <tbody>
              <tr>
                <td className='type'>parentHash</td>
                <td className='hash'>{
                  isLinkable && number.gtn(1)
                    ? <Link to={`/explorer/hash/${parentHex}`}>{parentHex}</Link>
                    : parentHex
                }</td>
              </tr>
              <tr>
                <td className='type'>extrinsicsRoot</td>
                <td className='hash'>{u8aToHex(extrinsicsRoot)}</td>
              </tr>
              <tr>
                <td className='type'>stateRoot</td>
                <td className='hash'>{u8aToHex(stateRoot)}</td>
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

export default withApi(BlockHeader);
