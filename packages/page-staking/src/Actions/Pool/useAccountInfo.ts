// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletNominationPoolsDelegator, PalletNominationPoolsRewardPool } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { AccountInfo } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { BN_ZERO, bnMax } from '@polkadot/util';

const OPT_DEL = {
  transform: (opt: Option<PalletNominationPoolsDelegator>): PalletNominationPoolsDelegator | null =>
    opt.unwrapOr(null)
};

function createInfo (delegator: PalletNominationPoolsDelegator, rewardPool: PalletNominationPoolsRewardPool, poolPoints: BN, currentBalance: BN): AccountInfo {
  const lastTotalEarnings = rewardPool.totalEarnings;
  const currTotalEarnings = bnMax(BN_ZERO, currentBalance.sub(rewardPool.balance)).add(rewardPool.totalEarnings);
  const newEarnings = bnMax(BN_ZERO, currTotalEarnings.sub(lastTotalEarnings));
  const newPoints = poolPoints.mul(newEarnings);
  const currentPoints = rewardPool.points.add(newPoints);
  const newEarningsSinceLastClaim = bnMax(BN_ZERO, currTotalEarnings.sub(delegator.rewardPoolTotalEarnings));
  const delegatorVirtualPoints = delegator.points.mul(newEarningsSinceLastClaim);

  return {
    claimable: delegatorVirtualPoints.isZero() || currentPoints.isZero() || currentBalance.isZero()
      ? BN_ZERO
      : delegatorVirtualPoints.mul(currentBalance).div(currentPoints),
    delegator
  };
}

function useAccountInfoImpl (accountId: string, rewardPool: PalletNominationPoolsRewardPool, poolPoints: BN, rewardBalance?: BN): AccountInfo | undefined | null {
  const { api } = useApi();
  const delegator = useCall(api.query.nominationPools.delegators, [accountId], OPT_DEL);

  return useMemo(
    () => delegator && rewardBalance && createInfo(delegator, rewardPool, poolPoints, bnMax(BN_ZERO, rewardBalance.sub(api.consts.balances.existentialDeposit))),
    [api, delegator, poolPoints, rewardPool, rewardBalance]
  );
}

export default createNamedHook('useAccountInfo', useAccountInfoImpl);
