// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useState, useEffect } from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';

export default function useCounter (): number {
  const { api, isApiReady } = useApi();
  const proposals = useCall<any[]>(isApiReady ? api.derive.democracy.proposals : undefined, []);
  const referenda = useCall<any[]>(isApiReady ? api.derive.democracy.referendums : undefined, []);
  const [counter, setCounter] = useState(0);

  useEffect((): void => {
    setCounter(
      (proposals?.length || 0) +
      (referenda?.length || 0)
    );
  }, [proposals, referenda]);

  return counter;
}
