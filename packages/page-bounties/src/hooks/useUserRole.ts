// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId } from '@polkadot/types/interfaces';
import type { UserRole } from '../types.js';

import { useMemo } from 'react';

import { createNamedHook, useAccounts, useCollectiveMembers } from '@polkadot/react-hooks';

export interface UserRolesInfo { roles: UserRole[], isCurator: boolean }

function useUserRoleImpl (curatorId?: AccountId): UserRolesInfo {
  const { allAccounts, hasAccounts } = useAccounts();
  const { isMember } = useCollectiveMembers('council');

  return useMemo((): UserRolesInfo => {
    const isCurator = !!curatorId && allAccounts.includes(curatorId.toString());
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

    return { isCurator, roles };
  }, [allAccounts, curatorId, hasAccounts, isMember]);
}

export const useUserRole = createNamedHook('useUserRole', useUserRoleImpl);
