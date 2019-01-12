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

// FIXME 7 Nov 2018 Due to mismatches with block hashes between Substrate and BBQ,
// the hashes are retrieved and not calculated (go back to calculated once resolved)
import BlockHash from './BlockHash';
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
    const seal = logs.filter(({ type }) => type === 'Seal');
    const validator = seal && query_session_validators.length
      ? query_session_validators[seal[0].toNumber() % query_session_validators.length]
      : undefined;

    return (
      <article className='explorer--BlockHeader'>
        <div className='details'>
          <div className='header'>
            <div className='number'>
              <div>{numberFormat(blockNumber)}&nbsp;</div>
              <div className='validator'>{validator
                ? <AddressMini value={validator} />
                : undefined
              }</div>
            </div>
            <div className='hash'>
              <BlockHash
                blockNumber={blockNumber}
                withLink={withLink}
              />
            </div>
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
        </div>
      </article>
    );
  }
}

export default withCall('query.session.validators')(BlockHeader);
