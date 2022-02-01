// Copyright 2017-2022 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveTreasuryProposals } from '@polkadot/api-derive/types';

import { useMemo } from 'react';

import { createNamedHook, useAccounts, useApi, useCall } from '@polkadot/react-hooks';

function useCounterImpl (): number {
  const { hasAccounts } = useAccounts();
  const { api, isApiReady } = useApi();
  const proposals = useCall<DeriveTreasuryProposals>(isApiReady && hasAccounts && api.derive.treasury?.proposals);

  return useMemo(
    () => proposals?.proposals.length || 0,
    [proposals]
  );
}

export default createNamedHook('useCounter', useCounterImpl);
