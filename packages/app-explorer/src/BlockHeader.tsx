// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { HeaderExtended } from '@polkadot/api-derive';
import { AddressMini, LinkPolkascan } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

interface Props extends BareProps {
  isSummary?: boolean;
  value?: HeaderExtended;
  withExplorer?: boolean;
  withLink?: boolean;
}

const renderDetails = ({ number: blockNumber, extrinsicsRoot, parentHash, stateRoot }: HeaderExtended): React.ReactNode => {
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
};

function BlockHeader ({ className, isSummary, value, withExplorer, withLink }: Props): React.ReactElement<Props> | null {
  if (!value) {
    return null;
  }

  const hashHex = value.hash.toHex();
  const textNumber = formatNumber(value.number);

  return (
    <article className={`explorer--BlockHeader ${className}`}>
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
          : renderDetails(value)
      }
      {
        withExplorer
          ? <LinkPolkascan data={hashHex} type='block' />
          : undefined
      }
    </article>
  );
}

export default styled(BlockHeader)`
  .author {
    font-size: 1rem;
    text-align: right;
    vertical-align: middle;

    > .ui--AddressMini.padded {
      padding: 0;
    }
  }

  .header {
    color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;

    > div {
      display: inline-block;
      font-weight: 100;
      vertical-align: middle;
      white-space: nowrap;
    }

    > .number {
      font-size: 2.25rem;
    }

    .hash {
      font-size: 1.5rem;
      font-family: sans-serif;
    }
  }

  .hash {
    font-family: monospace;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .number {
    align-items: center;
    box-sizing: border-box;
  }

  .contains {
    border: 0;
    margin-top: 0.5rem;
    text-align: center;

    > .info {
      margin-bottom: 0.125em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .ui--Labelled {
        text-align: center;
      }

      > label {
        display: inline-block;
      }

      > span,
      > label {
        vertical-align: middle;
      }

      label {
        margin-right: 0.5rem;
        min-width: 10rem;
        text-align: right;
      }
    }
  }
`;
