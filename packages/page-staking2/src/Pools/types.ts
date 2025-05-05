// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u32 } from '@polkadot/types';
import type { PalletNominationPoolsBondedPoolInner, PalletNominationPoolsPoolMember, PalletNominationPoolsRewardPool } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

export interface PoolAccounts {
  rewardId: string;
  stashId: string;
}

export interface OwnPoolBase {
  members: Record<string, PalletNominationPoolsPoolMember>;
  poolId: u32;
}

export interface OwnPool extends OwnPoolBase, PoolAccounts {
  // nothing additional, only combined
}

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
