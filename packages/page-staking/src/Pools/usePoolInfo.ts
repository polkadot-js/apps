// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { Codec } from '@polkadot/types/types';
import type { BN } from '@polkadot/util';
import type { PoolInfo } from './types';

import { createNamedHook, useApi, useCallMulti } from '@polkadot/react-hooks';

const options = {
  transform: ([bonded, metadata, reward]: [Option<PoolInfo['bonded'] & Codec>, PoolInfo['metadata'], Option<PoolInfo['reward'] & Codec>]): PoolInfo => ({
    bonded: bonded.unwrapOr(null),
    metadata,
    reward: reward.unwrapOr(null)
  })
};

function usePoolInfoImpl (id: BN): PoolInfo {
  const { api } = useApi();

  return useCallMulti([
    [api.query.nominationPools.bondedPools, id],
    [api.query.nominationPools.metadata, id],
    [api.query.nominationPools.rewardPools, id]
  ], options);
}

export default createNamedHook('usePoolInfo', usePoolInfoImpl);
