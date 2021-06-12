// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balance } from '@polkadot/types/interfaces';

import { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { useApi, useCall } from '@polkadot/react-hooks';

export function useBalance (accountId: string | null): Balance | undefined {
  const { api } = useApi();

  return useCall<DeriveBalancesAll>(api.derive.balances?.all, [accountId])?.availableBalance;
}
