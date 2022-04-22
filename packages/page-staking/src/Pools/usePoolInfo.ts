// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAccount, DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { Bytes, Option } from '@polkadot/types';
import type { PalletNominationPoolsBondedPoolInner, PalletNominationPoolsRewardPool } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { PoolInfo, PoolInfoBase } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall, useCallMulti } from '@polkadot/react-hooks';

import usePoolAccounts from '../usePoolAccounts';

const OPT_MULTI = {
  defaultValue: null,
  transform: ([bonded, metadata, reward]: [Option<PalletNominationPoolsBondedPoolInner>, Bytes, Option<PalletNominationPoolsRewardPool>]): PoolInfoBase | null =>
    bonded.isSome && reward.isSome
      ? {
        bonded: bonded.unwrap(),
        metadata: metadata.length
          ? metadata.isUtf8
            ? metadata.toUtf8()
            : metadata.toString()
          : null,
        reward: reward.unwrap()
      }
      : null
};

const OPT_REWARD = {
  transform: ({ freeBalance }: DeriveBalancesAccount): BN =>
    freeBalance
};

const OPT_NOMS = {
  transform: ({ nominators }: DeriveStakingAccount): string[] =>
    nominators.map((n) => n.toString())
};

function usePoolInfoImpl (poolId: BN): PoolInfo | null | undefined {
  const { api } = useApi();
  const baseInfo = useCallMulti([
    [api.query.nominationPools.bondedPools, poolId],
    [api.query.nominationPools.metadata, poolId],
    [api.query.nominationPools.rewardPools, poolId]
  ], OPT_MULTI);
  const accounts = usePoolAccounts(poolId);
  const rewardFree = useCall(api.derive.balances.account, [accounts.accountReward], OPT_REWARD);
  const nominating = useCall(api.derive.staking.account, [accounts.accountStash], OPT_NOMS);

  return useMemo(
    () => baseInfo && rewardFree && nominating && {
      ...accounts,
      ...baseInfo,
      nominating,
      rewardClaimable: rewardFree.sub(api.consts.balances.existentialDeposit)
    },
    [api, baseInfo, accounts, nominating, rewardFree]
  );
}

export default createNamedHook('usePoolInfo', usePoolInfoImpl);
