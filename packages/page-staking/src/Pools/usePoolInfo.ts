// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Bytes, Option } from '@polkadot/types';
import type { PalletNominationPoolsBondedPoolInner, PalletNominationPoolsRewardPool } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { PoolInfo } from './types';

import { createNamedHook, useApi, useCallMulti } from '@polkadot/react-hooks';

const OPT_MULTI = {
  defaultValue: null,
  transform: ([bonded, metadata, reward]: [Option<PalletNominationPoolsBondedPoolInner>, Bytes, Option<PalletNominationPoolsRewardPool>]): PoolInfo | null =>
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

  return useCallMulti([
    [api.query.nominationPools.bondedPools, poolId],
    [api.query.nominationPools.metadata, poolId],
    [api.query.nominationPools.rewardPools, poolId]
  ], OPT_MULTI);
}

export default createNamedHook('usePoolInfo', usePoolInfoImpl);
