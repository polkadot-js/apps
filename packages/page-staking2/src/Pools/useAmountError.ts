// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { BN } from '@polkadot/util';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

function useAmountErrorImpl (accountId?: string | null, amount?: BN | null, minAmount?: BN | null): boolean {
  const { api } = useApi();
  const balances = useCall<DeriveBalancesAll>(!!accountId && api.derive.balances.all, [accountId]);

  return useMemo(
    () => !amount || amount.isZero() || !minAmount || minAmount.gt(amount) || (
      !!balances &&
      amount.gt(balances.availableBalance.sub(api.consts.balances.existentialDeposit))
    ),
    [api, amount, balances, minAmount]
  );
}

export default createNamedHook('useAmountError', useAmountErrorImpl);
