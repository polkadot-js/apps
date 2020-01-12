// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types/interfaces';

import { useState, useEffect } from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';

export default function useCounter (): number {
  const { api, isApiReady } = useApi();
  const proposals = useCall<Hash[]>(isApiReady ? api.query.technicalCommittee && api.query.technicalCommittee.proposals : undefined, []);
  const [counter, setCounter] = useState(0);

  useEffect((): void => {
    setCounter(proposals?.length || 0);
  }, [proposals]);

  return counter;
}
