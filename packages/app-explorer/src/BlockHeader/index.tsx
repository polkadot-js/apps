// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Header } from '@polkadot/types';
import { BareProps } from '@polkadot/ui-app/types';

import './BlockHeader.css';

import React from 'react';
import { Link } from 'react-router-dom';
import { withCall } from '@polkadot/ui-api/index';
import { AddressMini } from '@polkadot/ui-app/index';
import numberFormat from '@polkadot/ui-reactive/util/numberFormat';

import Extrinsics from './Extrinsics';

type Props = BareProps & {
  query_session_validators?: Array<AccountId>,
  value?: Header,
  withExtrinsics?: boolean,
  withLink?: boolean
};

class BlockHeader extends React.PureComponent<Props> {
  render () {
    const { query_session_validators = [], value, withExtrinsics = false, withLink = false } = this.props;

    if (!value) {
      return null;
    }

    const { blockNumber, digest: { logs }, extrinsicsRoot, parentHash, stateRoot } = value;
    const parentHex = parentHash.toHex();
    const hashHex = value.hash.toHex();
    const digestItem = logs.find(({ type }) => type === 'Seal');
    const authorId = digestItem && query_session_validators.length
      ? query_session_validators[digestItem.asSeal.slot.toNumber() % query_session_validators.length]
      : undefined;

    return (
      <article className='explorer--BlockHeader'>
        <div className='details'>
          <div className='header'>
            <div className='number'>{numberFormat(blockNumber)}&nbsp;</div>
            <div className='hash'>{
              withLink
                ? <Link to={`/explorer/hash/${hashHex}`}>{hashHex}</Link>
                : hashHex
            }</div>
          </div>
          <div className='contains'>
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
          <div className='author'>{
            authorId
              ? <AddressMini value={authorId} />
              : undefined
          }</div>
        </div>
      </article>
    );
  }
}

export default withCall('query.session.validators')(BlockHeader);
