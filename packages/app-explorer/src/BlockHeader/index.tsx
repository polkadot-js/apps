// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Header } from '@polkadot/api-codec';
import { BareProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-react-rx/types';

import './BlockHeader.css';

import React from 'react';
import { Link } from 'react-router-dom';
import numberFormat from '@polkadot/ui-react-rx/util/numberFormat';
import withApi from '@polkadot/ui-react-rx/with/api';

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
    const hashHex = value.hash.toHex();
    const parentHex = value.parentHash.toHex();

    return (
      <div className='explorer--BlockHeader'>
        <div className='number'>
          <div>{numberFormat(value.blockNumber.toBn())}</div>
        </div>
        <div className='details'>
          <div className='hash'>{
            isLinkable && withLink
              ? <Link to={`/explorer/hash/${hashHex}`}>{hashHex}</Link>
              : hashHex
          }</div>
          <table className='contains'>
            <tbody>
              <tr>
                <td className='type'>parentHash</td>
                <td className='hash'>{
                  isLinkable && value.blockNumber.gt(1)
                    ? <Link to={`/explorer/hash/${parentHex}`}>{parentHex}</Link>
                    : parentHex
                }</td>
              </tr>
              <tr>
                <td className='type'>extrinsicsRoot</td>
                <td className='hash'>{value.extrinsicsRoot.toHex()}</td>
              </tr>
              <tr>
                <td className='type'>stateRoot</td>
                <td className='hash'>{value.stateRoot.toHex()}</td>
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

export default withApi(BlockHeader);
