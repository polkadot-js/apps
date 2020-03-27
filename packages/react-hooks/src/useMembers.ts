// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';
import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';

interface Result {
  isMember: boolean;
  members: string[];
}

export default function useMembers (collective: 'council' | 'technicalCommittee'): Result {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [state, setState] = useState<Result>({ isMember: false, members: [] });
  const retrieved = (
    collective === 'council'
      ? useCall<string[]>(api.query.electionsPhragmen?.members || api.query.elections.members, [], {
        transform: (accounts: [AccountId, Balance][]): string[] =>
          accounts.map(([accountId]) => accountId.toString())
      })
      : useCall<string[]>(api.query.technicalCommittee.members, [], {
        transform: (accounts: AccountId[]): string[] =>
          accounts.map((accountId) => accountId.toString())
      })
  );

  useEffect((): void => {
    retrieved && setState({
      isMember: retrieved.some((accountId): boolean => allAccounts.includes(accountId)),
      members: retrieved
    });
  }, [allAccounts, retrieved]);

  return state;
}
