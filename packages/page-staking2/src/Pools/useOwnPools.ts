// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletNominationPoolsPoolMember } from '@polkadot/types/lookup';
import type { OwnPool, OwnPoolBase } from './types.js';

import { useMemo } from 'react';

import { createNamedHook, useAccounts, useApi, useCall } from '@polkadot/react-hooks';

import { createAccounts } from './usePoolAccounts.js';

const OPT_MULTI = {
  transform: ([[ids], opts]: [[string[]], Option<PalletNominationPoolsPoolMember>[]]): OwnPoolBase[] => {
    const pools: OwnPoolBase[] = [];

    for (let i = 0; i < ids.length; i++) {
      if (opts[i].isSome) {
        const member = opts[i].unwrap();
        let entry = pools.find(({ poolId }) => poolId.eq(member.poolId));

        if (!entry) {
          entry = { members: {}, poolId: member.poolId };

          pools.push(entry);
        }

        entry.members[ids[i]] = member;
      }
    }

    return pools;
  },
  withParamsTransform: true
};

function useOwnPoolsImpl (): OwnPool[] | undefined {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const base = useCall(api.query.nominationPools?.poolMembers.multi, [allAccounts], OPT_MULTI);

  return useMemo(
    () => base?.map((base) => ({
      ...base,
      ...createAccounts(api, base.poolId)
    })),
    [api, base]
  );
}

export default createNamedHook('useOwnPools', useOwnPoolsImpl);
