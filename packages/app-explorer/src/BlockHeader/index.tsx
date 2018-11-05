// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Header } from '@polkadot/types';
import { BareProps } from '@polkadot/ui-app/types';

import './BlockHeader.css';

import React from 'react';
import { Link } from 'react-router-dom';
import numberFormat from '@polkadot/ui-react-rx/util/numberFormat';

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

    const hashHex = value.hash.toHex();
    const parentHex = value.parentHash.toHex();

    return (
      <div className='explorer--BlockHeader'>
        <div className='details'>
          <div className='header'>
            <div className='number'>#{numberFormat(value.blockNumber.toBn())}&nbsp;</div>
            <div className='hash'>{
              withLink
                ? <Link to={`/explorer/hash/${hashHex}`}>{hashHex}</Link>
                : hashHex
            }</div>
          </div>
          <div className='contains'>
            <div>
              <div className='type'>parentHash</div>
              <div className='hash'>{
                value.blockNumber.gt(1)
                  ? <Link to={`/explorer/hash/${parentHex}`}>{parentHex}</Link>
                  : parentHex
              }</div>
            </div>
            <div>
              <div className='type'>extrinsicsRoot</div>
              <div className='hash'>{value.extrinsicsRoot.toHex()}</div>
            </div>
            <div>
              <div className='type'>stateRoot</div>
              <div className='hash'>{value.stateRoot.toHex()}</div>
            </div>
            {withExtrinsics
              ? <Extrinsics hash={value.hash} />
              : undefined
            }
          </div>
        </div>
      </div>
    );
  }
}
