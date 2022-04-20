// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Bytes, Option } from '@polkadot/types';
import type { PalletNominationPoolsBondedPoolInner, PalletNominationPoolsRewardPool } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { PoolInfo } from './types';

import { createNamedHook, useApi, useCallMulti } from '@polkadot/react-hooks';

const OPT_MULTI = {
  transform: ([bonded, metadata, reward]: [Option<PalletNominationPoolsBondedPoolInner>, Bytes, Option<PalletNominationPoolsRewardPool>]): PoolInfo => ({
    bonded: bonded.unwrapOr(null),
    metadata: metadata.length
      ? metadata.isUtf8
        ? metadata.toUtf8()
        : metadata.toString()
      : null,
    reward: reward.unwrapOr(null)
  })
};

function usePoolInfoImpl (id: BN): PoolInfo | undefined {
  const { api } = useApi();

  return useCallMulti([
    [api.query.nominationPools.bondedPools, id],
    [api.query.nominationPools.metadata, id],
    [api.query.nominationPools.rewardPools, id]
  ], OPT_MULTI);
}

export default createNamedHook('usePoolInfo', usePoolInfoImpl);
