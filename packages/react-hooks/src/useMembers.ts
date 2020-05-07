// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';
import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';

interface Result {
  isMember: boolean;
  members: string[];
}

export default function useMembers (collective: 'council' | 'technicalCommittee' = 'council'): Result {
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();
  const [state, setState] = useState<Result>({ isMember: false, members: [] });
  const retrieved = useCall<string[]>(hasAccounts && api.query[collective]?.members, [], {
    transform: (accounts: AccountId[]) => accounts.map((accountId) => accountId.toString())
  });

  useEffect((): void => {
    retrieved && setState({
      isMember: retrieved.some((accountId) => allAccounts.includes(accountId)),
      members: retrieved
    });
  }, [allAccounts, retrieved]);

  return state;
}
