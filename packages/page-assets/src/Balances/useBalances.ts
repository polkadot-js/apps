// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { PalletAssetsAssetBalance } from '@polkadot/types/lookup';

import { createNamedHook, useAccounts, useApi, useCall } from '@polkadot/react-hooks';

interface BalanceResult {
  accountId: string;
  balance: PalletAssetsAssetBalance;
}

interface Result {
  assetId: BN;
  balances: BalanceResult[];
}

const queryOptions = {
  transform: ([[params], balances]: [[[BN, string][]], PalletAssetsAssetBalance[]]): Result => ({
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

function useBalancesImpl (id?: BN | null): BalanceResult[] | null {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const query = useCall(id && api.query.assets.account.multi, id && [allAccounts.map((a) => [id, a])], queryOptions);

  return (query && id && (query.assetId === id) && query.balances) || null;
}

export default createNamedHook('useBalances', useBalancesImpl);
