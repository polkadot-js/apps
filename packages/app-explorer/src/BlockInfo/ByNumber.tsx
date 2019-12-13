/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types/interfaces';

import React from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';

import BlockByHash from './ByHash';

interface Props {
  value: string;
}

export default function BlockByNumber ({ value }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const getBlockHash = useCall<Hash>(api.rpc.chain.getBlockHash as any, [value]);

  if (!getBlockHash) {
    return null;
  }

  return (
    <BlockByHash value={getBlockHash.toHex()} />
  );
}
