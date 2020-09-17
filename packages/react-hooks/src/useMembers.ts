// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AccountId } from '@polkadot/types/interfaces';

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

export default function useMembers (collective: 'council' | 'technicalCommittee' = 'council'): Result {
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();
  const retrieved = useCall<string[]>(hasAccounts && api.query[collective]?.members, undefined, transformMembers);

  return useMemo(
    () => ({
      isMember: (retrieved || []).some((accountId) => allAccounts.includes(accountId)),
      members: (retrieved || [])
    }),
    [allAccounts, retrieved]
  );
}
