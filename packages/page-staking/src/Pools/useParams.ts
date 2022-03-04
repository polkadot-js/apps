// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, u32 } from '@polkadot/types';
import type { BN } from '@polkadot/util';
import type { Params } from './types';

import { createNamedHook, useApi, useCallMulti } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

const queryOptions = {
  defaultValue: {
    maxDelegators: 0,
    maxDelegatorsPool: 0,
    maxPools: 0
  },
  transform: ([maxDelegators, maxDelegatorsPerPool, maxPools, minCreateBond, minJoinBond, minNominatorBond]: [Option<u32>, Option<u32>, Option<u32>, BN, BN, BN]): Params => ({
    maxDelegators: maxDelegators.unwrapOr(BN_ZERO).toNumber(),
    maxDelegatorsPool: maxDelegatorsPerPool.unwrapOr(BN_ZERO).toNumber(),
    maxPools: maxPools.unwrapOr(BN_ZERO).toNumber(),
    minCreateBond,
    minJoinBond,
    minNominatorBond
  })
};

function useParamsImpl (): Params {
  const { api } = useApi();

  return useCallMulti<Params>([
    api.query.nominationPools.maxDelegators,
    api.query.nominationPools.maxDelegatorsPerPool,
    api.query.nominationPools.maxPools,
    api.query.nominationPools.minCreateBond,
    api.query.nominationPools.minJoinBond,
    api.query.staking.minNominatorBond
  ], queryOptions);
}

export default createNamedHook('useParams', useParamsImpl);
