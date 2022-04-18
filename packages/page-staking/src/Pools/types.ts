// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId32 } from '@polkadot/types/interfaces';
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

export interface PoolInfo {
  bonded: PalletNominationPoolsBondedPoolInner | null;
  reward: PalletNominationPoolsRewardPool | null;
  metadata: string | null;
}

export interface MembersMapEntry {
  accountId: AccountId32;
  info: PalletNominationPoolsDelegator;
}

export type MembersMap = Record<string, MembersMapEntry[]>;
