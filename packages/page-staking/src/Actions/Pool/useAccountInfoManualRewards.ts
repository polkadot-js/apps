// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletNominationPoolsPoolMember } from '@polkadot/types/lookup';
import type { AccountInfo } from './types.js';

import { useEffect, useState } from 'react';

import usePoolInfo from '@polkadot/app-staking2/Pools/usePoolInfo';
import { createNamedHook, useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';
import { PalletNominationPoolsBondedPoolInner, PalletNominationPoolsRewardPool } from '@polkadot/types/lookup';
import { BN } from '@polkadot/util';

const OPT_DEL = {
  transform: (opt: Option<PalletNominationPoolsPoolMember>): PalletNominationPoolsPoolMember | null =>
    opt.unwrapOr(null)
};

// as per polkadot-staking-dashboard code
function calculatePayout (
  bondedPool: PalletNominationPoolsBondedPoolInner,
  rewardPool: PalletNominationPoolsRewardPool,
  member: PalletNominationPoolsPoolMember,
  rewardAccountBalance: BN
) {
  const rewardCounterBase = new BN(10).pow(new BN(18));

  // convert needed values into BNs
  const totalRewardsClaimed = new BN(rewardPool.totalRewardsClaimed);
  const lastRecordedTotalPayouts = new BN(rewardPool.lastRecordedTotalPayouts);
  const memberLastRecordedRewardCounter = new BN(member.lastRecordedRewardCounter);
  const poolLastRecordedRewardCounter = new BN(rewardPool.lastRecordedRewardCounter);
  const bondedPoolPoints = new BN(bondedPool.points);
  const points = new BN(member.points);
  const rewardPoolBalance = rewardAccountBalance;

  // calculate the current reward counter
  const payoutsSinceLastRecord = rewardPoolBalance
    .add(totalRewardsClaimed)
    .sub(lastRecordedTotalPayouts);

  const currentRewardCounter = (
    bondedPoolPoints.eq(new BN(0))
      ? new BN(0)
      : payoutsSinceLastRecord.mul(rewardCounterBase).div(bondedPoolPoints)
  ).add(poolLastRecordedRewardCounter);

  const pendingRewards = currentRewardCounter
    .sub(memberLastRecordedRewardCounter)
    .mul(points)
    .div(rewardCounterBase);

  return pendingRewards;
}

function useAccountInfoManualRewardsImpl (accountId: string, poolId: BN): AccountInfo | null {
  const { api } = useApi();
  const isMountedRef = useIsMountedRef();
  const [state, setState] = useState<AccountInfo | null>(null);
  const member = useCall(api.query.nominationPools.poolMembers, [accountId], OPT_DEL);
  const poolInfo = usePoolInfo(poolId);

  useEffect((): void => {
    member && poolInfo && isMountedRef.current && setState(
      { claimable: calculatePayout(poolInfo.bonded, poolInfo.reward, member, poolInfo.rewardClaimable), member });
  }, [accountId, member, poolInfo, isMountedRef]);

  return state;
}

export default createNamedHook('useAccountInfoManualRewards', useAccountInfoManualRewardsImpl);
