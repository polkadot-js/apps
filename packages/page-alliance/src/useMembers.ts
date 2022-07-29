// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId32 } from '@polkadot/types/interfaces';
import type { Member } from './types';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCallMulti } from '@polkadot/react-hooks';

const ROLES = <const> ['Founder', 'Fellow', 'Ally'];

function addMembers (prev: Member[], query: AccountId32[][]): Member[] {
  const all: Member[] = [];

  for (let i = 0; i < ROLES.length; i++) {
    const role = ROLES[i];
    const accountIds = query[i];

    for (let j = 0; j < accountIds.length; j++) {
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

  return all;
}

function useMembersImpl (): Member[] | undefined {
  const { api } = useApi();
  const [state, setState] = useState<Member[] | undefined>();
  const query = useCallMulti<AccountId32[][]>([
    [api.query.alliance.members, ROLES[0]],
    [api.query.alliance.members, ROLES[1]],
    [api.query.alliance.members, ROLES[2]]
  ]);

  useEffect((): void => {
    query && query.length === ROLES.length &&
      setState((prev = []) => addMembers(prev, query));
  }, [query]);

  return state;
}

export default createNamedHook('useMembers', useMembersImpl);
