// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Bytes, Option } from '@polkadot/types';
import type { PalletNominationPoolsBondedPoolInner, PalletNominationPoolsRewardPool } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { PoolInfo, PoolInfoBase } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCallMulti } from '@polkadot/react-hooks';

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

function usePoolInfoImpl (poolId: BN): PoolInfo | null {
  const { api } = useApi();
  const baseInfo = useCallMulti([
    [api.query.nominationPools.bondedPools, poolId],
    [api.query.nominationPools.metadata, poolId],
    [api.query.nominationPools.rewardPools, poolId]
  ], OPT_MULTI);
  const accounts = usePoolAccounts(poolId);

  return useMemo(
    () => baseInfo && { ...accounts, ...baseInfo },
    [baseInfo, accounts]
  );
}

export default createNamedHook('usePoolInfo', usePoolInfoImpl);
