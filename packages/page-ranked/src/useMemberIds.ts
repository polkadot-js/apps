// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Changes } from '@polkadot/react-hooks/useEventChanges';
import type { StorageKey } from '@polkadot/types';
import type { AccountId32, EventRecord } from '@polkadot/types/interfaces';
import type { PalletColl } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useEventChanges, useMapKeys } from '@polkadot/react-hooks';

const OPT_ID = {
  transform: (keys: StorageKey<[AccountId32]>[]): AccountId32[] =>
    keys.map(({ args: [id] }) => id)
};

function filter (records: EventRecord[]): Changes<AccountId32> {
  const added: AccountId32[] = [];
  const removed: AccountId32[] = [];

  records.forEach(({ event: { data: [id], method } }): void => {
    if (method === 'MemberAdded') {
      added.push(id as AccountId32);
    } else {
      removed.push(id as AccountId32);
    }
  });

  return { added, removed };
}

function useMemberIdsImpl (collective: PalletColl): string[] | undefined {
  const { api } = useApi();
  const startValue = useMapKeys(api.query[collective].members, OPT_ID);
  const accountIds = useEventChanges([
    api.events[collective].MemberAdded,
    api.events[collective].MemberRemoved
  ], filter, startValue);

  return useMemo(
    () => accountIds && accountIds.map((a) => a.toString()),
    [accountIds]
  );
}

export default createNamedHook('useMemberIds', useMemberIdsImpl);
