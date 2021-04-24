// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AssetBalance, AssetId } from '@polkadot/types/interfaces';
import type { AssetInfoComplete } from '../types';

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

export default function useBalances (info?: AssetInfoComplete | null): BalanceResult[] | null {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const query = useCall(info && api.query.assets.account.multi, info && [allAccounts.map((a) => [info.id, a])], queryOptions);

  return (query && info && (query.assetId === info.id) && query.balances) || null;
}
