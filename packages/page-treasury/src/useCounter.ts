// Copyright 2017-2021 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveTreasuryProposals } from '@polkadot/api-derive/types';

import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';

export default function useCounter (): number {
  const { hasAccounts } = useAccounts();
  const { api, isApiReady } = useApi();

  return useCall<DeriveTreasuryProposals>(isApiReady && hasAccounts && api.derive.treasury?.proposals)?.proposals.length || 0;
}
