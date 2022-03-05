// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
    delegatorCounter: BN;
    depositor: AccountId;
    nominator: AccountId;
    points: BN;
    root: AccountId;
    state: {
      isOpen: boolean;
    }
    stateToggler: AccountId;
  } | null;
  reward: {
    account: AccountId;
    balance: BN;
    points: BN;
    totalEarnings: BN;
  } | null;
}
