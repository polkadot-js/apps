// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AssetBalance, AssetId } from '@polkadot/types/interfaces';
import type { AssetInfoComplete } from '../types';

import { useEffect, useState } from 'react';

import { useAccounts, useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';

interface Result {
  accountId: string;
  balance: AssetBalance;
}

const queryOptions = {
  transform: ([[params], results]: [[[AssetId, string][]], AssetBalance[]]): Result[] =>
    results
      .map((balance, index) => ({
        accountId: params[index][1],
        balance
      }))
      .filter(({ balance: { balance } }) => !balance.isZero()),
  withParamsTransform: true
};

export default function useBalances (info?: AssetInfoComplete | null): Result[] | null {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<Result[] | null>(null);
  const query = useCall(info && api.query.assets.account.multi, info && [allAccounts.map((a) => [info.id, a])], queryOptions);

  useEffect((): void => {
    if (mountedRef.current) {
      setState(null);

      if (info) {
        // dummy
      }
    }
  }, [info, mountedRef]);

  useEffect((): void => {
    if (mountedRef.current && query) {
      setState(query);
    }
  }, [query, mountedRef]);

  return state;
}
