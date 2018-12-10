// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Header } from '@polkadot/types';
import { BareProps } from '@polkadot/ui-app/types';

import './BlockHeader.css';

import React from 'react';
import { Link } from 'react-router-dom';
import numberFormat from '@polkadot/ui-react-rx/util/numberFormat';

// FIXME 7 Nov 2018 Due to mismatches with block hashes between Substrate and BBQ,
// the hashes are retrieved and not calculated (go back to calculated once resolved)
import BlockHash from './BlockHash';
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

    const { blockNumber, extrinsicsRoot, parentHash, stateRoot } = value;
    const parentHex = parentHash.toHex();

    return (
      <article className='explorer--BlockHeader'>
        <div className='details'>
          <div className='header'>
            <div className='number'>{numberFormat(blockNumber)}&nbsp;</div>
            <div className='hash'>
              <BlockHash
                blockNumber={blockNumber}
                withLink={withLink}
              />
            </div>
          </div>
          <div className='contains'>
            <div>
              <div className='type'>parentHash</div>
              <div className='hash'>{
                value.blockNumber.gtn(1)
                  ? <Link to={`/explorer/hash/${parentHex}`}>{parentHex}</Link>
                  : parentHex
              }</div>
            </div>
            <div>
              <div className='type'>extrinsicsRoot</div>
              <div className='hash'>{extrinsicsRoot.toHex()}</div>
            </div>
            <div>
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
