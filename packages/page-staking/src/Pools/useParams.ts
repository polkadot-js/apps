// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, u32 } from '@polkadot/types';
import type { BN } from '@polkadot/util';
import type { Params } from './types';

import { createNamedHook, useApi, useCallMulti } from '@polkadot/react-hooks';
import { BN_ONE, BN_ZERO } from '@polkadot/util';

const queryOptions = {
  defaultValue: {
    lastPoolId: BN_ZERO,
    maxDelegators: 0,
    maxDelegatorsPool: 0,
    maxPools: 0,
    nextPoolId: BN_ONE
  },
  transform: ([lastPoolId, maxDelegators, maxDelegatorsPerPool, maxPools, minCreateBond, minJoinBond, minNominatorBond]: [BN, Option<u32>, Option<u32>, Option<u32>, BN, BN, BN]): Params => ({
    lastPoolId,
    maxDelegators: maxDelegators.unwrapOr(BN_ZERO).toNumber(),
    maxDelegatorsPool: maxDelegatorsPerPool.unwrapOr(BN_ZERO).toNumber(),
    maxPools: maxPools.unwrapOr(BN_ZERO).toNumber(),
    minCreateBond,
    minJoinBond,
    minNominatorBond,
    nextPoolId: lastPoolId.add(BN_ONE)
  })
};

function useParamsImpl (): Params {
  const { api } = useApi();

  return useCallMulti<Params>([
    api.query.nominationPools.lastPoolId,
    api.query.nominationPools.maxPoolMembers,
    api.query.nominationPools.maxPoolMembersPerPool,
    api.query.nominationPools.maxPools,
    api.query.nominationPools.minCreateBond,
    api.query.nominationPools.minJoinBond,
    api.query.staking.minNominatorBond
  ], queryOptions);
}

export default createNamedHook('useParams', useParamsImpl);
