// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance } from '@polkadot/types/interfaces';

import { useState, useEffect } from 'react';
import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';

interface Result {
  isMember: boolean;
  members: string[];
}

export default function useCouncilMembers (): Result {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const queryMembers = useCall<[AccountId, Balance][]>(api.query.council.members, []);
  const [members, setMembers] = useState<Result>({ isMember: false, members: [] });

  useEffect((): void => {
    if (allAccounts && queryMembers) {
      const members = queryMembers.map((accountId): string => accountId.toString());

      setMembers({
        members,
        isMember: members.some((accountId): boolean => allAccounts.includes(accountId))
      });
    }
  }, [allAccounts, queryMembers]);

  return members;
}
