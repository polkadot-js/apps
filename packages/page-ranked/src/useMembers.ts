// Copyright 2017-2025 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { AccountId32 } from '@polkadot/types/interfaces';
import type { PalletRankedCollectiveMemberRecord } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { Member, PalletColl } from './types.js';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

import useMembersIds from './useMemberIds.js';

interface Result {
  memberIds: string[];
  memberRanks: BN[];
  members: Member[];
}

const OPT_MEM = {
  transform: ([[ids], infos]: [[AccountId32[]], Option<PalletRankedCollectiveMemberRecord>[]]): Result => {
    const members = infos
      .map((info, i) => [info.unwrapOr(null), ids[i]])
      .filter((r): r is [PalletRankedCollectiveMemberRecord, AccountId32] => !!r[0])
      .sort(([a], [b]) => b.rank.cmp(a.rank))
      .map(([info, accountId]): Member => ({
        accountId: accountId.toString(),
        info
      }));

    return {
      memberIds: members.map(({ accountId }) => accountId),
      memberRanks: members.map(({ info }) => info.rank),
      members
    };
  },
  withParamsTransform: true
};

function useMembersImpl (collective: PalletColl): Result | undefined {
  const { api } = useApi();
  const ids = useMembersIds(collective);
  const result = useCall(ids && ids.length !== 0 && api.query[collective].members.multi, [ids], OPT_MEM);

  return useMemo(
    () => ids && ids.length === 0
      ? { memberIds: [], memberRanks: [], members: [] }
      : result,
    [ids, result]
  );
}

export default createNamedHook('useMembers', useMembersImpl);
