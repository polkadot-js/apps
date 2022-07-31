// Copyright 2017-2022 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { AccountId32 } from '@polkadot/types/interfaces';
import type { PalletRankedCollectiveMemberRecord } from '@polkadot/types/lookup';
import type { Member, PalletColl } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

import useMembersIds from './useMemberIds';

interface Result {
  memberIds: string[];
  members: Member[];
}

const OPT_MEM = {
  transform: ([[ids], infos]: [[AccountId32[]], Option<PalletRankedCollectiveMemberRecord>[]]) =>
    infos
      .map((info, i) => [info.unwrapOr(null), ids[i]])
      .filter((r): r is [PalletRankedCollectiveMemberRecord, AccountId32] => !!r[0])
      .map(([info, accountId]): Member => ({
        accountId: accountId.toString(),
        info
      })),
  withParamsTransform: true
};

function createResult (members: Member[]): Result {
  const memberIds = members.map(({ accountId }) => accountId);

  return {
    memberIds,
    members
  };
}

function useMembersImpl (collective: PalletColl): Result | undefined {
  const { api } = useApi();
  const memberIds = useMembersIds(collective);
  const all = useCall(memberIds && memberIds.length !== 0 && api.query[collective].members.multi, [memberIds], OPT_MEM);

  return useMemo(
    () => all && createResult(all),
    [all]
  );
}

export default createNamedHook('useMembers', useMembersImpl);
