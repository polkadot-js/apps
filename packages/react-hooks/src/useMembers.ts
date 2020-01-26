// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance } from '@polkadot/types/interfaces';

import { useMemo } from 'react';
import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';

interface Result {
  isMember: boolean;
  members: string[];
}

export default function useMembers (collective: 'council' | 'technicalCommittee'): Result {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const isCouncil = collective === 'council';

  const members = isCouncil
    ? (useCall<[AccountId, Balance][]>(api.query.electionsPhragmen?.members || api.query.elections.members) || [])
      .map(([accountId]) => accountId.toString())
    : (useCall<AccountId[]>(api.query.technicalCommittee.members) || [])
      ?.map(accountId => accountId.toString());
  const isMember = useMemo(
    (): boolean => members.some((accountId): boolean => allAccounts.includes(accountId)),
    [members, allAccounts]
  );

  return { isMember, members };
}
