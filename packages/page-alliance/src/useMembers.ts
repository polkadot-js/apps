// Copyright 2017-2025 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId32 } from '@polkadot/types/interfaces';
import type { Member } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

const ROLES = ['Retiring', 'Ally', 'Fellow'] as const;

function addMembers (prev: Member[], ...query: AccountId32[][]): Member[] {
  const all: Member[] = [];

  for (let i = 0; i < ROLES.length; i++) {
    const role = ROLES[i];
    const accountIds = query[i];

    for (let j = 0, count = accountIds.length; j < count; j++) {
      const accountId = accountIds[j].toString();
      const existing = prev.find((p) =>
        p.accountId === accountId &&
        p.role === role
      );

      all.push(existing || {
        accountId,
        role
      });
    }
  }

  return all.reverse();
}

function useMembersImpl (): Member[] | undefined {
  const { api } = useApi();
  const [state, setState] = useState<Member[] | undefined>();
  const role0 = useCall<AccountId32[]>(api.query.alliance.members, [ROLES[0]]);
  const role1 = useCall<AccountId32[]>(api.query.alliance.members, [ROLES[1]]);
  const role2 = useCall<AccountId32[]>(api.query.alliance.members, [ROLES[2]]);

  useEffect((): void => {
    role0 && role1 && role2 &&
      setState((prev = []) =>
        addMembers(prev, role0, role1, role2)
      );
  }, [role0, role1, role2]);

  return state;
}

export default createNamedHook('useMembers', useMembersImpl);
