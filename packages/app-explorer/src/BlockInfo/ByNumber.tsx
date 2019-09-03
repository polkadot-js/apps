/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types/interfaces';

import React from 'react';
import { withCalls } from '@polkadot/react-api';

import BlockByHash from './ByHash';

interface Props {
  chain_getBlockHash?: Hash;
  value: string;
}

function BlockByNumber ({ chain_getBlockHash }: Props): React.ReactElement<Props> | null {
  if (!chain_getBlockHash) {
    return null;
  }

  return (
    <BlockByHash value={chain_getBlockHash.toHex()} />
  );
}

export default withCalls<Props>(
  ['rpc.chain.getBlockHash', { paramName: 'value' }]
)(BlockByNumber);
