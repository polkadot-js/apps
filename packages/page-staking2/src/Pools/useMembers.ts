// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Changes } from '@polkadot/react-hooks/useEventChanges';
import type { bool, Option, StorageKey, u32, u128 } from '@polkadot/types';
import type { AccountId32, EventRecord } from '@polkadot/types/interfaces';
import type { PalletNominationPoolsPoolMember } from '@polkadot/types/lookup';
import type { MembersMap, MembersMapEntry } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall, useEventChanges, useMapEntries } from '@polkadot/react-hooks';

const EMPTY_START: AccountId32[] = [];

const OPT_ENTRIES = {
  transform: (entries: [StorageKey<[AccountId32]>, Option<PalletNominationPoolsPoolMember>][]): MembersMap =>
    entries.reduce((all: MembersMap, [{ args: [accountId] }, optMember]) => {
      if (optMember.isSome) {
        const member = optMember.unwrap();
        const poolId = member.poolId.toString();

        if (!all[poolId]) {
          all[poolId] = [];
        }

        all[poolId].push({
          accountId: accountId.toString(),
          member
        });
      }

      return all;
    }, {})
};

const OPT_MULTI = {
  transform: ([[ids], values]: [[AccountId32[]], Option<PalletNominationPoolsPoolMember>[]]): MembersMapEntry[] =>
    ids
      .filter((_, i) => values[i].isSome)
      .map((accountId, i) => ({
        accountId: accountId.toString(),
        member: values[i].unwrap()
      })),
  withParamsTransform: true
};

function filterEvents (records: EventRecord[]): Changes<AccountId32> {
  const added: AccountId32[] = [];
  const removed: AccountId32[] = [];

  records.forEach(({ event: { data, method } }): void => {
    if (method === 'Bonded') {
      const [accountId,,, joined] = data as unknown as [AccountId32, u32, u128, bool];

      if (joined.isTrue) {
        added.push(accountId);
      }
    }
  });

  return { added, removed };
}

function interleave (prev: MembersMap, additions: MembersMapEntry[]): MembersMap {
  return additions.reduce<MembersMap>((all, entry) => {
    const poolId = entry.member.poolId.toString();
    const arr: MembersMapEntry[] = [];

    if (all[poolId]) {
      all[poolId].forEach((prev): void => {
        if (prev.accountId !== entry.accountId) {
          arr.push(prev);
        }
      });
    }

    arr.push(entry);

    all[poolId] = arr;

    return all;
  }, { ...prev });
}

function useMembersImpl (): MembersMap | undefined {
  const { api } = useApi();
  const [membersMap, setMembersMap] = useState<MembersMap | undefined>();
  const queryMap = useMapEntries(api.query.nominationPools.poolMembers, [], OPT_ENTRIES);
  const ids = useEventChanges([
    api.events.nominationPools.Bonded
  ], filterEvents, EMPTY_START);
  const additions = useCall(ids && ids.length !== 0 && api.query.nominationPools.poolMembers.multi, [ids], OPT_MULTI);

  // initial entries
  useEffect((): void => {
    queryMap && setMembersMap(queryMap);
  }, [queryMap]);

  // additions via events
  useEffect((): void => {
    additions && setMembersMap((prev) => prev && interleave(prev, additions));
  }, [additions]);

  return membersMap;
}

export default createNamedHook('useMembers', useMembersImpl);
