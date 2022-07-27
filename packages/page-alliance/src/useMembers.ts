// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId32 } from '@polkadot/types/interfaces';
import type { Member } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCallMulti } from '@polkadot/react-hooks';

const ROLES = <const> ['Founder', 'Fellow', 'Ally'];

function addMembers (all: Member[], role: Member['role'], accountIds: AccountId32[] = []): Member[] {
  for (let i = 0; i < accountIds.length; i++) {
    all.push({
      accountId: accountIds[i].toString(),
      role
    });
  }

  return all;
}

function useMembersImpl (): Member[] | undefined {
  const { api } = useApi();
  const query = useCallMulti<AccountId32[][]>([
    [api.query.alliance.members, ROLES[0]],
    [api.query.alliance.members, ROLES[1]],
    [api.query.alliance.members, ROLES[2]]
  ]);

  return useMemo((): Member[] | undefined => {
    if (query && query.length === ROLES.length) {
      const all: Member[] = [];

      for (let i = 0; i < ROLES.length; i++) {
        addMembers(all, ROLES[i], query[i]);
      }

      return all;
    }

    return undefined;
  }, [query]);
}

export default createNamedHook('useMembersImpl', useMembersImpl);
