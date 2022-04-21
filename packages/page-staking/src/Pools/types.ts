// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletNominationPoolsBondedPoolInner, PalletNominationPoolsDelegator, PalletNominationPoolsRewardPool } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

export interface Params {
  maxMembers: number;
  maxMembersPerPool: number;
  maxPools: number;
  minCreateBond?: BN;
  minJoinBond?: BN;
  minMemberBond?: BN;
  minNominatorBond?: BN;
}

export interface PoolInfoBase {
  bonded: PalletNominationPoolsBondedPoolInner;
  reward: PalletNominationPoolsRewardPool;
  metadata: string | null;
}

export interface PoolInfo extends PoolInfoBase {
  accountReward: string;
  accountStash: string;
}

export interface MembersMapEntry {
  accountId: string;
  info: PalletNominationPoolsDelegator;
}

export type MembersMap = Record<string, MembersMapEntry[]>;
