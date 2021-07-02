// Copyright 2017-2021 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId } from '@polkadot/types/interfaces';

import { useMemo } from 'react';

import { useAccounts } from './useAccounts';
import { useApi } from './useApi';
import { useCall } from './useCall';

interface Result {
  isMember: boolean;
  members: string[];
}

const transformMembers = {
  transform: (accounts: AccountId[]) =>
    accounts.map((accountId) => accountId.toString())
};

export function useMembers (collective: 'council' | 'membership' | 'technicalCommittee'): Result {
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();
  const retrieved = useCall<string[]>(hasAccounts && api.derive[collective]?.members, undefined, transformMembers);

  return useMemo(
    () => ({
      isMember: (retrieved || []).some((accountId) => allAccounts.includes(accountId)),
      members: (retrieved || [])
    }),
    [allAccounts, retrieved]
  );
}
