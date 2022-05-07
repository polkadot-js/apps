// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Bytes, Option } from '@polkadot/types';
import type { FrameSystemAccountInfo, PalletNominationPoolsBondedPoolInner, PalletNominationPoolsRewardPool, PalletStakingNominations } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { PoolInfo, PoolInfoBase } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCallMulti } from '@polkadot/react-hooks';
import { BN_ZERO, bnMax } from '@polkadot/util';

import usePoolAccounts from '../usePoolAccounts';

const OPT_MULTI = {
  defaultValue: null,
  transform: ([optBonded, metadata, optReward, optNominating, accountInfo]: [Option<PalletNominationPoolsBondedPoolInner>, Bytes, Option<PalletNominationPoolsRewardPool>, Option<PalletStakingNominations>, FrameSystemAccountInfo]): PoolInfoBase | null =>
    optBonded.isSome && optReward.isSome
      ? {
        bonded: optBonded.unwrap(),
        metadata: metadata.length
          ? metadata.isUtf8
            ? metadata.toUtf8()
            : metadata.toString()
          : null,
        nominating: optNominating
          .unwrapOr({ targets: [] })
          .targets.map((n) => n.toString()),
        reward: optReward.unwrap(),
        rewardClaimable: accountInfo.data.free
      }
      : null
};

function usePoolInfoImpl (poolId: BN): PoolInfo | null | undefined {
  const { api } = useApi();
  const accounts = usePoolAccounts(poolId);
  const baseInfo = useCallMulti([
    [api.query.nominationPools.bondedPools, poolId],
    [api.query.nominationPools.metadata, poolId],
    [api.query.nominationPools.rewardPools, poolId],
    [api.query.staking.nominators, accounts.stashId],
    [api.query.system.account, accounts.rewardId]
  ], OPT_MULTI);

  return useMemo(
    () => baseInfo && {
      ...accounts,
      ...baseInfo,
      rewardClaimable: bnMax(BN_ZERO, baseInfo.rewardClaimable.sub(api.consts.balances.existentialDeposit))
    },
    [api, baseInfo, accounts]
  );
}

export default createNamedHook('usePoolInfo', usePoolInfoImpl);
