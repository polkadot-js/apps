// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletNominationPoolsDelegator } from '@polkadot/types/lookup';
import type { OwnPool, OwnPoolBase } from './types';

import { useMemo } from 'react';

import { createNamedHook, useAccounts, useApi, useCall } from '@polkadot/react-hooks';

import { createAccount } from './usePoolAccounts';

const OPT_MULTI = {
  transform: ([[ids], all]: [[string[]], Option<PalletNominationPoolsDelegator>[]]): OwnPoolBase[] =>
    ids
      .map((id, i): [string, Option<PalletNominationPoolsDelegator>] => [id, all[i]])
      .filter(([, o]) => o.isSome)
      .map(([id, o]): [string, PalletNominationPoolsDelegator] => [id, o.unwrap()])
      .reduce((pools: OwnPoolBase[], [accountId, d]): OwnPoolBase[] => {
        let entry = pools.find(({ poolId }) => poolId.eq(d.poolId));

        if (!entry) {
          entry = { members: {}, poolId: d.poolId };

          pools.push(entry);
        }

        entry.members[accountId] = d;

        return pools;
      }, []),
  withParamsTransform: true
};

function useOwnPoolsImpl (): OwnPool[] | undefined {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const base = useCall(api.query.nominationPools?.delegators.multi, [allAccounts], OPT_MULTI);

  return useMemo(
    () => base && base.map((base) => ({
      ...base,
      accountReward: createAccount(api, base.poolId, 1),
      accountStash: createAccount(api, base.poolId, 0)
    })),
    [api, base]
  );
}

export default createNamedHook('useOwnPools', useOwnPoolsImpl);
