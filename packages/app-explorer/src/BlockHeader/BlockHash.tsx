// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Link } from 'react-router-dom';
import { withCall } from '@polkadot/ui-api/index';
import { BlockNumber, Hash } from '@polkadot/types';

type Props = I18nProps & {
  blockNumber: BlockNumber,
  rpc_chain_getBlockHash?: Hash,
  withLink?: boolean
};

class BlockHash extends React.PureComponent<Props> {
  render () {
    const { rpc_chain_getBlockHash, withLink } = this.props;

    if (!rpc_chain_getBlockHash) {
      return null;
    }

    const hashHex = rpc_chain_getBlockHash.toHex();

    return (
      withLink
        ? <Link to={`/explorer/hash/${hashHex}`}>{hashHex}</Link>
        : hashHex
    );
  }
}

export default withCall('rpc.chain.getBlockHash', {
  paramProp: 'blockNumber'
})(BlockHash);
