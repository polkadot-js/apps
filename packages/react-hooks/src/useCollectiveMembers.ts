// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId } from '@polkadot/types/interfaces';
import type { CollectiveType } from './types.js';

import { useMemo } from 'react';

import { createNamedHook } from './createNamedHook.js';
import { useAccounts } from './useAccounts.js';
import { useApi } from './useApi.js';
import { useCall } from './useCall.js';

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
    accountId?.toString() || null
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
