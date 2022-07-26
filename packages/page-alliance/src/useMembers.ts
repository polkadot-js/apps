// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageKey } from '@polkadot/types';
import type { AccountId32 } from '@polkadot/types/interfaces';
import type { PalletAllianceMemberRole } from '@polkadot/types/lookup';
import type { Member } from './types';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

const OPT_MEM = {
  transform: (entries: [StorageKey<[PalletAllianceMemberRole]>, AccountId32[]][]) =>
    entries
      .reduce((all: Member[], [{ args: [role] }, accountIds]): Member[] => {
        for (let i = 0; i < accountIds.length; i++) {
          all.push({
            accountId: accountIds[i].toString(),
            role
          });
        }

        return all;
      }, [])
      .sort((a, b) =>
        a.role.type === b.role.type
          ? 0
          : a.role.type === 'Founder'
            ? -1
            : b.role.type === 'Founder'
              ? 1
              : a.role.type === 'Fellow'
                ? -1
                : 1
      )
};

function useMembersImpl (): Member[] | undefined {
  const { api } = useApi();

  return useCall<Member[]>(api.query.alliance.members.entries, [], OPT_MEM);
}

export default createNamedHook('useMembersImpl', useMembersImpl);
