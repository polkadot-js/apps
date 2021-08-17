// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId } from '@polkadot/types/interfaces';

import { useMemo } from 'react';

import { useAccounts, useCollectiveMembers } from '@polkadot/react-hooks';

import { UserRole } from '../types';

export type UserRolesInfo = { roles: UserRole[], isCurator: boolean };

export function useUserRole (curatorId?: AccountId): UserRolesInfo {
  const { allAccounts, hasAccounts } = useAccounts();

  const { isMember } = useCollectiveMembers('council');

  const isCurator = useMemo(() => curatorId && allAccounts.includes(curatorId.toString()), [allAccounts, curatorId]);

  const roles: UserRole[] = [];

  if (isCurator) {
    roles.push('Curator');
  }

  if (isMember) {
    roles.push('Member');
  }

  if (hasAccounts) {
    roles.push('User');
  }

  return { isCurator: !!isCurator, roles };
}
