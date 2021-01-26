// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId } from '@polkadot/types/interfaces';

import { useMemo } from 'react';

import { useAccounts, useMembers } from '@polkadot/react-hooks';

import { UserRole } from '../types';

export function useUserRole (curatorId: AccountId): UserRole {
  const { allAccounts, hasAccounts } = useAccounts();

  const { isMember } = useMembers();

  const isCurator = useMemo(() => allAccounts.includes(curatorId.toString()), [allAccounts, curatorId]);

  if (isCurator) {
    return 'Curator';
  }

  if (isMember) {
    return 'Member';
  }

  if (hasAccounts) {
    return 'User';
  }

  return 'None';
}
