// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Link } from 'react-router-dom';
import jsonrpc from '@polkadot/jsonrpc';
import { withObservable } from '@polkadot/ui-react-rx/with/index';
import { BlockNumber, Hash } from '@polkadot/types';

type Props = I18nProps & {
  blockNumber: BlockNumber,
  getBlockHash?: Hash,
  withLink?: boolean
};

class BlockHash extends React.PureComponent<Props> {
  render () {
    const { getBlockHash, withLink } = this.props;

    if (!getBlockHash) {
      return null;
    }

    const hashHex = getBlockHash.toHex();

    return (
      withLink
        ? <Link to={`/explorer/hash/${hashHex}`}>{hashHex}</Link>
        : hashHex
    );
  }
}

export default withObservable('rawCall', {
  params: [jsonrpc.chain.methods.getBlockHash],
  paramProp: 'blockNumber',
  propName: 'getBlockHash'
})(BlockHash);
