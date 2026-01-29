// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { AccountId32 } from '@polkadot/types/interfaces';
import type { ListNode } from './types.js';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

const DERIVE_OPTS = {
  transform: (all: DeriveStakingAccount[]): ListNode[] => {
    const infos = all.map(({ stakingLedger, stashId }, index): ListNode => ({
      bonded: stakingLedger.active.unwrap(),
      index,
      jump: null,
      stashId: stashId.toString()
    }));

    return infos.map((info) => {
      const lower = infos.find(({ bonded, index }) =>
        index < info.index &&
        bonded.lt(info.bonded)
      );

      if (lower) {
        info.jump = lower.stashId;
      }

      return info;
    });
  }
};

function useBondedImpl (ids?: false | AccountId32[]): ListNode[] | undefined {
  const { api } = useApi();

  return useCall(ids && ids.length !== 0 && api.derive.staking.accounts, [ids], DERIVE_OPTS);
}

export default createNamedHook('useBonded', useBondedImpl);
