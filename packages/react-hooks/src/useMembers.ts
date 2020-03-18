// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance } from '@polkadot/types/interfaces';

import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';

interface Result {
  isMember: boolean;
  members: string[];
}

function getResult (allAccounts: string[], members: string[]): Result {
  return {
    isMember: members.some((accountId): boolean => allAccounts.includes(accountId)),
    members
  };
}

export default function useMembers (collective: 'council' | 'technicalCommittee'): Result {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const state = (
    collective === 'council'
      ? useCall<Result>(api.query.electionsPhragmen?.members || api.query.elections.members, [], {
        transform: (accounts: [AccountId, Balance][]): Result =>
          getResult(allAccounts, accounts.map(([accountId]) => accountId.toString()))
      })
      : useCall<Result>(api.query.technicalCommittee.members, [], {
        transform: (accounts: AccountId[]): Result =>
          getResult(allAccounts, accounts.map((accountId) => accountId.toString()))
      })
  ) || { isMember: false, members: [] };

  return state;
}
