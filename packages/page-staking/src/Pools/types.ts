// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Bytes } from '@polkadot/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

export interface Params {
  maxDelegators: number;
  maxDelegatorsPool: number;
  maxPools: number;
  minCreateBond?: BN;
  minJoinBond?: BN;
  minNominatorBond?: BN;
}

// FIXME Once available, use types from lookup
export interface PoolInfo {
  bonded: {
    points: BN;
    state: {
      isOpen: boolean;
    }
    delegatorCounter: BN;
    roles: {
      depositor: AccountId;
      root: AccountId;
      nominator: AccountId;
      stateToggler: AccountId;
    };
  } | null;
  reward: {
    balance: BN;
    totalEarnings: BN;
    points: BN;
  } | null;
  metadata: Bytes;
}
