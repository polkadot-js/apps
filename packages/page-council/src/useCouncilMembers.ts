// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance } from '@polkadot/types/interfaces';

import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';

interface Result {
  isMember: boolean;
  members: string[];
}
function transform (allAccounts: string[]): (queryMembers: [AccountId, Balance][]) => Result {
  return (queryMembers: [AccountId, Balance][]): Result => {
    const members = queryMembers.map((accountId): string => accountId.toString());

    return {
      members,
      isMember: members.some((accountId): boolean => allAccounts.includes(accountId))
    };
  };
}

export default function useCouncilMembers (): Result {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const members = useCall<Result>(!!allAccounts.length && api.query.council.members, [], {
    transform: transform(allAccounts)
  }) || { isMember: false, members: [] };

  return members;
}
