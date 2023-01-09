// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletNominationPoolsPoolMember, PalletNominationPoolsRewardPool } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { AccountInfo, PalletNominationPoolsPoolMemberV0, PalletNominationPoolsRewardPoolV0 } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { BN_ZERO, bnMax } from '@polkadot/util';

import { isPrevMember, isPrevPool } from './is';

const OPT_DEL = {
  transform: (opt: Option<PalletNominationPoolsPoolMember>): PalletNominationPoolsPoolMember | PalletNominationPoolsPoolMemberV0 | null =>
    opt.unwrapOr(null)
};

function createInfoPrev (member: PalletNominationPoolsPoolMemberV0, rewardPool: PalletNominationPoolsRewardPoolV0, poolPoints: BN, currentBalance: BN): AccountInfo {
  const lastTotalEarnings = rewardPool.totalEarnings;
  const currTotalEarnings = bnMax(BN_ZERO, currentBalance.sub(rewardPool.balance)).add(rewardPool.totalEarnings);
  const newEarnings = bnMax(BN_ZERO, currTotalEarnings.sub(lastTotalEarnings));
  const newPoints = poolPoints.mul(newEarnings);
  const currentPoints = rewardPool.points.add(newPoints);
  const newEarningsSinceLastClaim = bnMax(BN_ZERO, currTotalEarnings.sub(member.rewardPoolTotalEarnings));
  const delegatorVirtualPoints = member.points.mul(newEarningsSinceLastClaim);

  return {
    claimable: delegatorVirtualPoints.isZero() || currentPoints.isZero() || currentBalance.isZero()
      ? BN_ZERO
      : delegatorVirtualPoints.mul(currentBalance).div(currentPoints),
    member
  };
}

function useAccountInfoImpl (accountId: string, rewardPool: PalletNominationPoolsRewardPool, poolPoints: BN, rewardClaimable: BN): AccountInfo | undefined | null {
  const { api } = useApi();
  const member = useCall(api.query.nominationPools.poolMembers, [accountId], OPT_DEL);

  return useMemo(
    () => isPrevPool(rewardPool)
      ? member && (
        isPrevMember(member)
          ? createInfoPrev(member, rewardPool, poolPoints, rewardClaimable)
          : null
      )
      : null,
    [member, poolPoints, rewardPool, rewardClaimable]
  );
}

export default createNamedHook('useAccountInfo', useAccountInfoImpl);
