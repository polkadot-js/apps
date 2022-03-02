// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, u32 } from '@polkadot/types';
import type { BN } from '@polkadot/util';
import type { Params } from './types';

import { useApi, useCallMulti } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

const queryOptions = {
  transform: ([maxDelegators, maxDelegatorsPerPool, maxPools, minCreateBond, minNominatorBond]: [Option<u32>, Option<u32>, Option<u32>, BN, BN]): Params => ({
    maxDelegators: maxDelegators.unwrapOr(BN_ZERO).toNumber(),
    maxDelegatorsPool: maxDelegatorsPerPool.unwrapOr(BN_ZERO).toNumber(),
    maxPools: maxPools.unwrapOr(BN_ZERO).toNumber(),
    minCreateBond,
    minNominatorBond
  })
};

export default function useParams (): Params {
  const { api } = useApi();

  return useCallMulti<Params>([
    api.query.nominationPools.maxDelegators,
    api.query.nominationPools.maxDelegatorsPerPool,
    api.query.nominationPools.maxPools,
    api.query.nominatorPools.minCreateBond,
    api.query.staking.minNominatorBond
  ], queryOptions);
}
