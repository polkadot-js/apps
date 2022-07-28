// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId } from '@polkadot/types/interfaces';
import type { CollectiveType } from './types';

import { useMemo } from 'react';

import { createNamedHook } from './createNamedHook';
import { useAccounts } from './useAccounts';
import { useApi } from './useApi';
import { useCall } from './useCall';

interface Result {
  isMember: boolean;
  members: string[];
  prime?: string | null;
}

const OPT_MEM = {
  transform: (accounts: AccountId[]): string[] =>
    accounts.map((a) => a.toString())
};

const OPT_PRM = {
  transform: (accountId: AccountId | null): string | null =>
    accountId && accountId.toString()
};

function useCollectiveMembersImpl (collective: CollectiveType): Result {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const members = useCall(api.derive[collective as 'council']?.members, [], OPT_MEM);
  const prime = useCall(api.derive[collective as 'council']?.prime, [], OPT_PRM);

  return useMemo(
    () => ({
      isMember: (members || []).some((a) => allAccounts.includes(a)),
      members: (members || []),
      prime
    }),
    [allAccounts, members, prime]
  );
}

export const useCollectiveMembers = createNamedHook('useCollectiveMembers', useCollectiveMembersImpl);
