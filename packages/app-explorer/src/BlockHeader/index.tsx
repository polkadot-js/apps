// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import './BlockHeader.css';

import React from 'react';
import { Link } from 'react-router-dom';
import { HeaderExtended } from '@polkadot/types/Header';
import { AddressMini } from '@polkadot/ui-app/index';
import numberFormat from '@polkadot/ui-reactive/util/numberFormat';

import Extrinsics from './Extrinsics';

type Props = BareProps & {
  isSummary?: boolean,
  value?: HeaderExtended,
  withExtrinsics?: boolean,
  withLink?: boolean
};

export default class BlockHeader extends React.PureComponent<Props> {
  render () {
    const { isSummary, value, withExtrinsics = false, withLink = false } = this.props;

    if (!value) {
      return null;
    }

    const { author, blockNumber, extrinsicsRoot, parentHash, stateRoot } = value;
    const parentHex = parentHash.toHex();
    const hashHex = value.hash.toHex();
    const textNumber = numberFormat(blockNumber);

    return (
      <article className={['explorer--BlockHeader', isSummary ? 'ui--hoverable summary' : ''].join(' ')}>
        <div className='details'>
          <div className='header'>
            <div className='number'>{
              withLink
              ? <Link to={`/explorer/hash/${hashHex}`}>{textNumber}</Link>
              : textNumber
            }&nbsp;</div>
            <div className='hash'>{hashHex}</div>
            <div className='author'>{
              author
                ? <AddressMini value={author} />
                : undefined
            }</div>
          </div>
          <div className='ui--hover contains'>
            <div className='info'>
              <div className='type'>parentHash</div>
              <div className='hash'>{
                value.blockNumber.gtn(1)
                  ? <Link to={`/explorer/hash/${parentHex}`}>{parentHex}</Link>
                  : parentHex
              }</div>
            </div>
            <div className='info'>
              <div className='type'>extrinsicsRoot</div>
              <div className='hash'>{extrinsicsRoot.toHex()}</div>
            </div>
            <div className='info'>
              <div className='type'>stateRoot</div>
              <div className='hash'>{stateRoot.toHex()}</div>
            </div>
            {withExtrinsics
              ? <Extrinsics hash={value.hash} />
              : undefined
            }
          </div>
        </div>
      </article>
    );
  }
}
