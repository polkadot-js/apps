// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletNominationPoolsDelegator } from '@polkadot/types/lookup';
import type { OwnPool } from './types';

import { createNamedHook, useAccounts, useApi, useCall } from '@polkadot/react-hooks';

const OPT_MULTI = {
  transform: ([[ids], all]: [[string[]], Option<PalletNominationPoolsDelegator>[]]): OwnPool[] =>
    ids
      .map((id, i): [string, Option<PalletNominationPoolsDelegator>] => [id, all[i]])
      .filter(([, o]) => o.isSome)
      .map(([id, o]): [string, PalletNominationPoolsDelegator] => [id, o.unwrap()])
      .reduce((pools: OwnPool[], [accountId, d]): OwnPool[] => {
        let entry = pools.find(({ poolId }) => poolId.eq(d.poolId));

        if (!entry) {
          entry = { accounts: {}, poolId: d.poolId };

          pools.push(entry);
        }

        entry.accounts[accountId] = d;

        return pools;
      }, []),
  withParamsTransform: true
};

function useOwnPoolsImpl (): OwnPool[] | undefined {
  const { api } = useApi();
  const { allAccounts } = useAccounts();

  return useCall(api.query.nominationPools?.delegators.multi, [allAccounts], OPT_MULTI);
}

export default createNamedHook('useOwnPools', useOwnPoolsImpl);
