// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveTreasuryProposals } from '@polkadot/api-derive/types';

import { useState, useEffect } from 'react';
import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';

export default function useCounter (): number {
  const { hasAccounts } = useAccounts();
  const { api, isApiReady } = useApi();
  const proposals = useCall<DeriveTreasuryProposals>(isApiReady && hasAccounts && api.derive.treasury?.proposals);
  const [counter, setCounter] = useState(0);

  useEffect((): void => {
    setCounter(proposals?.proposals.length || 0);
  }, [proposals]);

  return counter;
}
