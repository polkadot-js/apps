/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types/interfaces';
import { ApiProps } from '@polkadot/ui-api/types';

import React from 'react';
import { withCalls } from '@polkadot/ui-api';

import BlockByHash from './ByHash';

interface Props extends ApiProps {
  chain_getBlockHash?: Hash;
  value: string;
}

class BlockByNumber extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { chain_getBlockHash } = this.props;

    if (!chain_getBlockHash) {
      return null;
    }

    return (
      <BlockByHash value={chain_getBlockHash.toHex()} />
    );
  }
}

export default withCalls<Props>(
  ['rpc.chain.getBlockHash', { paramName: 'value' }]
)(BlockByNumber);
