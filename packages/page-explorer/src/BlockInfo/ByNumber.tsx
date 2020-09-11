// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import { Spinner } from '@polkadot/react-components';
import { useApi, useIsMountedRef } from '@polkadot/react-hooks';

import BlockByHash from './ByHash';

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
        mountedRef.current && setError(error);
      });
  }, [api, mountedRef, value]);

  if (!getBlockHash && !error) {
    return <Spinner />;
  }

  return (
    <BlockByHash
      error={error}
      value={getBlockHash ? getBlockHash.toHex() : null}
    />
  );
}

export default React.memo(BlockByNumber);
