// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveCollectiveProposals } from '@polkadot/api-derive/types';
import { BlockNumber } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';

export default function useCounter (): number {
  const { api, isApiReady } = useApi();
  const [counter, setCounter] = useState(0);
  const bestNumber = useCall<BlockNumber>(isApiReady && api.derive.chain.bestNumber, []);
  const proposals = useCall<DeriveCollectiveProposals>(isApiReady && api.derive.council?.proposals, []);

  useEffect((): void => {
    bestNumber && proposals && setCounter((prev: number): number => {
      const filtered = proposals.filter(({ votes }) => votes?.end.gt(bestNumber));

      return filtered.length !== prev
        ? filtered.length
        : prev;
    });
  }, [bestNumber, proposals]);

  return counter;
}
