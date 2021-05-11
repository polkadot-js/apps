// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AssetBalance, AssetId } from '@polkadot/types/interfaces';

import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';

interface BalanceResult {
  accountId: string;
  balance: AssetBalance;
}

interface Result {
  assetId: AssetId;
  balances: BalanceResult[];
}

const queryOptions = {
  transform: ([[params], balances]: [[[AssetId, string][]], AssetBalance[]]): Result => ({
    assetId: params[0][0],
    balances: params
      .map(([, accountId], index) => ({
        accountId,
        balance: balances[index]
      }))
      .filter(({ balance: { balance } }) => !balance.isZero())
  }),
  withParamsTransform: true
};

export default function useBalances (id?: AssetId | null): BalanceResult[] | null {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const query = useCall(id && api.query.assets.account.multi, id && [allAccounts.map((a) => [id, a])], queryOptions);

  return (query && id && (query.assetId === id) && query.balances) || null;
}
