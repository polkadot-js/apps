// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveTreasuryProposals } from '@polkadot/api-derive/types';

import { useState, useEffect } from 'react';
import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';

export default function useCounter (): number {
  const { hasAccounts } = useAccounts();
  const { api, isApiReady } = useApi();
  const proposals = useCall<DeriveTreasuryProposals>(isApiReady && hasAccounts && api.derive.treasury?.proposals, []);
  const [counter, setCounter] = useState(0);

  useEffect((): void => {
    setCounter(proposals?.proposals.length || 0);
  }, [proposals?.proposals.length]);

  return counter;
}
