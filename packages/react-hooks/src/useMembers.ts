// Copyright 2017-2021 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId } from '@polkadot/types/interfaces';

import { useMemo } from 'react';

import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';

interface Result {
  isMember: boolean;
  members: string[];
}

const transformMembers = {
  transform: (accounts: AccountId[]) =>
    accounts.map((accountId) => accountId.toString())
};

// SD: Modified function below to take default boolean argument
/**
 * Return members of a collective
 * @param collective
 * @param dontRequireAccount - If passed true, returns collective members regardless of app user has any accounts or not.
 * If false, return members only when user has an account
 */
export function useMembers (collective: 'council' | 'technicalCommittee' = 'council', dontRequireAccount = false): Result {
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();
  const retrieved = useCall<string[]>((dontRequireAccount || hasAccounts) && api.query[collective]?.members, undefined, transformMembers);

  return useMemo(
    () => ({
      isMember: (retrieved || []).some((accountId) => allAccounts.includes(accountId)),
      members: (retrieved || [])
    }),
    [allAccounts, retrieved]
  );
}
