// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import './BlockHeader.css';

import React from 'react';
import { Link } from 'react-router-dom';
import { HeaderExtended } from '@polkadot/api-derive';
import { AddressMini, LinkPolkascan } from '@polkadot/ui-app';
import { formatNumber } from '@polkadot/util';

interface Props extends BareProps {
  isSummary?: boolean;
  value?: HeaderExtended;
  withExplorer?: boolean;
  withLink?: boolean;
}

export default class BlockHeader extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { isSummary, value, withExplorer, withLink } = this.props;

    if (!value) {
      return null;
    }

    const hashHex = value.hash.toHex();
    const textNumber = formatNumber(value.number);

    return (
      <article className='explorer--BlockHeader'>
        <div className='header-outer'>
          <div className='header'>
            <div className='number'>{
              withLink
                ? <Link to={`/explorer/query/${hashHex}`}>{textNumber}</Link>
                : textNumber
            }&nbsp;</div>
            <div className='hash'>{hashHex}</div>
            <div className='author ui--media-small'>{
              value.author
                ? <AddressMini value={value.author} />
                : undefined
            }</div>
          </div>
        </div>
        {
          isSummary
            ? undefined
            : this.renderDetails(value)
        }
        {
          withExplorer
            ? <LinkPolkascan data={hashHex} type='block' />
            : undefined
        }
      </article>
    );
  }

  private renderDetails ({ number: blockNumber, extrinsicsRoot, parentHash, stateRoot }: HeaderExtended): React.ReactNode {
    const parentHex = parentHash.toHex();

    return (
      <div className='contains'>
        <div className='info'>
          <label>parentHash</label>
          <span className='hash'>{
            blockNumber.unwrap().gtn(1)
              ? <Link to={`/explorer/query/${parentHex}`}>{parentHex}</Link>
              : parentHex
          }</span>
        </div>
        <div className='info'>
          <label>extrinsicsRoot</label>
          <span className='hash'>{extrinsicsRoot.toHex()}</span>
        </div>
        <div className='info'>
          <label>stateRoot</label>
          <span className='hash'>{stateRoot.toHex()}</span>
        </div>
      </div>
    );
  }
}
