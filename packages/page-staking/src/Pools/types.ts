// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Codec } from '@polkadot/types/types';
import type { BN } from '@polkadot/util';

export interface Params {
  maxDelegators: number;
  maxDelegatorsPool: number;
  maxPools: number;
  minCreateBond?: BN;
  minJoinBond?: BN;
  minNominatorBond?: BN;
}

export interface PoolInfo {
  bonded: Record<string, Codec>;
  reward: Record<string, Codec>;
}
