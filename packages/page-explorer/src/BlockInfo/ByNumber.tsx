// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Hash } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';

import { useApi, useIsMountedRef } from '@polkadot/react-hooks';

import BlockByHash from './ByHash.js';

interface Props {
  value: string;
}

function BlockByNumber ({ value }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const [getBlockHash, setState] = useState<Hash | null>(null);
  const mountedRef = useIsMountedRef();
  const [error, setError] = useState<Error | null>(null);

  useEffect((): void => {
    api.rpc.chain
      .getBlockHash(value)
      .then((result): void => {
        mountedRef.current && setState(result);
      })
      .catch((error: Error): void => {
        console.error(1);

        mountedRef.current && setError(error);
      });
  }, [api, mountedRef, value]);

  return (
    <BlockByHash
      error={error}
      value={
        getBlockHash
          ? getBlockHash.toHex()
          : null
      }
    />
  );
}

export default React.memo(BlockByNumber);
