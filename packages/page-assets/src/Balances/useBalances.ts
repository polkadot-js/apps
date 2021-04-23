// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AssetBalance, AssetId } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import { useAccounts, useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';

interface Result {
  accountId: string;
  balance: AssetBalance;
}

const queryOptions = {
  transform: ([[params], balances]: [[[AssetId, string][]], AssetBalance[]]): Result[] =>
    params
      .map(([, accountId], index) => ({
        accountId,
        balance: balances[index]
      }))
      .filter(({ balance: { balance } }) => !balance.isZero()),
  withParamsTransform: true
};

export default function useBalances (id?: AssetId | null): Result[] | null {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<Result[] | null>(null);
  const query = useCall(id && api.query.assets.account.multi, [allAccounts.map((a) => [id, a])], queryOptions);

  useEffect((): void => {
    if (mountedRef.current) {
      setState(null);

      if (id) {
        // dummy
      }
    }
  }, [id, mountedRef]);

  useEffect((): void => {
    if (mountedRef.current && query) {
      setState(query);
    }
  }, [query, mountedRef]);

  return state;
}
