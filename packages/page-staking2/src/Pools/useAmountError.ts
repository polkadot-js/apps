// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { BN } from '@polkadot/util';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { BN_ZERO, hexToString } from '@polkadot/util';

// Consider only OpenGov-related locks
const openGovLockIds = ['referenda', 'convictionVoting', 'pyconvot'];

function useAmountErrorImpl (accountId?: string | null, amount?: BN | null, minAmount?: BN | null): boolean {
  const { api } = useApi();
  const balances = useCall<DeriveBalancesAll>(!!accountId && api.derive.balances.all, [accountId]);

  return useMemo(
    () => {
      if (!amount || amount.isZero() || !minAmount || minAmount.gt(amount) || !balances) {
        return true;
      }

      // Filter out OpenGov-related locks (those that don't prevent staking)
      const openGovLocks = balances.lockedBreakdown.filter((lock) => {
        return openGovLockIds.includes(hexToString(lock.id.toHex()));
      });

      // Total locked amount that affects staking
      const openGovLockedBalance = openGovLocks.reduce((acc, lock) => acc.add(lock.amount), BN_ZERO);

      const usableBalance = (balances.transferable || balances.availableBalance)
        .add(openGovLockedBalance)
        .sub(api.consts.balances.existentialDeposit);

      return amount.gt(usableBalance);
    },
    [api, amount, balances, minAmount]
  );
}

export default createNamedHook('useAmountError', useAmountErrorImpl);
