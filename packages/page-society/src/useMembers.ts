// Copyright 2017-2025 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSocietyMember } from '@polkadot/api-derive/types';
import type { OwnMembers } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useAccounts, useApi, useCall } from '@polkadot/react-hooks';

const EMPTY_MEMBERS: OwnMembers = { allMembers: [], isMember: false, ownMembers: [] };

function transform (allAccounts: string[], members: DeriveSocietyMember[]): OwnMembers {
  const allMembers = members
    .filter(({ isSuspended }) => !isSuspended)
    .map(({ accountId }) => accountId.toString());
  const ownMembers = allMembers.filter((a) => allAccounts.includes(a));

  return { allMembers, isMember: ownMembers.length !== 0, ownMembers };
}

function useMembersImpl (): OwnMembers {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [state, setState] = useState<OwnMembers>(EMPTY_MEMBERS);
  const members = useCall<DeriveSocietyMember[]>(api.derive.society.members);

  useEffect((): void => {
    allAccounts && members && setState(
      transform(allAccounts, members)
    );
  }, [allAccounts, members]);

  return state;
}

export default createNamedHook('useMembers', useMembersImpl);
