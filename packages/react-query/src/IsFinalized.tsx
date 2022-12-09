// Copyright 2017-2022 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber } from '@polkadot/types/interfaces';

import { useEffect, useMemo, useState } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { Hash } from '@polkadot/types/interfaces';

interface Props {
  blockNumber?: BlockNumber;
  hash: string | null | undefined;
}

function IsFinalizedImpl ({ blockNumber, hash }: Props): boolean | undefined {
  const { api } = useApi();
  const bestNumberFinalized = useCall<BlockNumber>(api.derive.chain.bestNumberFinalized);
  const [canonicalChainHash, setCanonicalHash] = useState<Hash | undefined>(undefined);

  useEffect((): void => {
    api.rpc.chain
      .getBlockHash(blockNumber)
      .then((result): void => {
        setCanonicalHash(result);
      })
      .catch(console.error);
  }, [api, blockNumber]);

  const isFinalized = useMemo(() => {
    if (bestNumberFinalized && blockNumber && canonicalChainHash && hash) {
      return bestNumberFinalized.toNumber() >= blockNumber.toNumber() && canonicalChainHash.toString() === hash;
    }

    return undefined;
  },
  [bestNumberFinalized, blockNumber, canonicalChainHash, hash]
  );

  return isFinalized;
}

export default createNamedHook('IsFinalized', IsFinalizedImpl);
