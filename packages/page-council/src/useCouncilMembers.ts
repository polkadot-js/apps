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
function transform (allAccounts: string[], queryMembers: [AccountId, Balance][]): Result {
  const members = queryMembers.map((accountId): string => accountId.toString());

  return {
    members,
    isMember: members.some((accountId): boolean => allAccounts.includes(accountId))
  };
}

export default function useCouncilMembers (): Result {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [state, setState] = useState<Result>({ isMember: false, members: [] });
  const queryMembers = useCall<[AccountId, Balance][]>(api.query.council.members, []);

  useEffect((): void => {
    allAccounts && queryMembers && setState(
      transform(allAccounts, queryMembers)
    );
  }, [allAccounts, queryMembers]);

  return state;
}
