// Copyright 2017-2022 @polkadot/app-uniques authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletAssetsAssetAccount } from '@polkadot/types/lookup';
import type { Option } from '@polkadot/types-codec';
import type { BN } from '@polkadot/util';

import { createNamedHook, useAccounts, useApi, useCall } from '@polkadot/react-hooks';

interface AccountResult {
  accountId: string;
  account: PalletAssetsAssetAccount;
}

interface Result {
  uniqueId: BN;
  accounts: AccountResult[];
}

function isOptional (value: PalletAssetsAssetAccount | Option<PalletAssetsAssetAccount>): value is Option<PalletAssetsAssetAccount> {
  return (value as Option<PalletAssetsAssetAccount>).isSome || (value as Option<PalletAssetsAssetAccount>).isNone;
}

const queryOptions = {
  transform: ([[params], accounts]: [[[BN, string][]], (PalletAssetsAssetAccount | Option<PalletAssetsAssetAccount>)[]]): Result => ({
    accounts: params
      .map(([, accountId], index) => {
        const o = accounts[index];

        return {
          account: isOptional(o)
            ? o.unwrapOr(null)
            : o,
          accountId
        };
      })
      .filter((a): a is AccountResult =>
        !!a.account &&
        !a.account.balance.isZero()
      ),
    uniqueId: params[0][0]
  }),
  withParamsTransform: true
};

function useBalancesImpl (id?: BN | null): AccountResult[] | null {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const query = useCall(id && api.query.uniques.account.multi, id && [allAccounts.map((a) => [id, a])], queryOptions);

  return (query && id && (query.uniqueId === id) && query.accounts) || null;
}

export default createNamedHook('useBalances', useBalancesImpl);
