// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletNominationPoolsBondedPoolInner, PalletNominationPoolsPoolMember, PalletNominationPoolsRewardPool } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { PoolAccounts } from '../types';

export interface Params {
  lastPoolId: BN;
  maxMembers: number;
  maxMembersPerPool: number;
  maxPools: number;
  minCreateBond?: BN;
  minJoinBond?: BN;
  minMemberBond?: BN;
  minNominatorBond?: BN;
  nextPoolId: BN;
}

export interface PoolInfoBase {
  bonded: PalletNominationPoolsBondedPoolInner;
  reward: PalletNominationPoolsRewardPool;
  metadata: string | null;
  nominating: string[];
  rewardClaimable: BN;
}

export interface PoolInfo extends PoolInfoBase, PoolAccounts {
  // nothing extra
}

export interface MembersMapEntry {
  accountId: string;
  member: PalletNominationPoolsPoolMember;
}

export type MembersMap = Record<string, MembersMapEntry[]>;
