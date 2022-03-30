// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId20, Perbill, Percent } from '@polkadot/types/interfaces/runtime';
import type { BTreeMap, Enum, Option, Struct, u32, u128, Vec } from '@polkadot/types-codec';

import { BN } from '@polkadot/util';

export interface ParachainStakingBond extends Struct {
  readonly owner: AccountId20;
  readonly amount: u128;
}

export interface ParachainStakingCandidateMetadata extends Struct {
  readonly bond: u128;
  readonly delegationCount: u32;
  readonly totalCounted: u128;
  readonly lowestTopDelegationAmount: u128;
  readonly highestBottomDelegationAmount: u128;
  readonly lowestBottomDelegationAmount: u128;
  readonly topCapacity: ParachainStakingCapacityStatus;
  readonly bottomCapacity: ParachainStakingCapacityStatus;
  readonly request: Option<ParachainStakingCandidateBondLessRequest>;
  readonly status: ParachainStakingCollatorStatus;
}

export interface ParachainStakingCapacityStatus extends Enum {
  readonly isFull: boolean;
  readonly isEmpty: boolean;
  readonly isPartial: boolean;
  readonly type: 'Full' | 'Empty' | 'Partial';
}

export interface ParachainStakingCandidateBondLessRequest extends Struct {
  readonly amount: u128;
  readonly whenExecutable: u32;
}

export interface ParachainStakingCollatorStatus extends Enum {
  readonly isActive: boolean;
  readonly isIdle: boolean;
  readonly isLeaving: boolean;
  readonly asLeaving: u32;
  readonly type: 'Active' | 'Idle' | 'Leaving';
}

export interface ParachainStakingDelegations extends Struct {
  readonly delegations: Vec<ParachainStakingBond>;
  readonly total: u128;
}

export interface ParachainStakingInflationInflationInfo extends Struct {
  readonly expect: ParachainStakingInflationRangeU128;
  readonly annual: ParachainStakingInflationRangePerbill;
  readonly round: ParachainStakingInflationRangePerbill;
}

export interface ParachainStakingInflationRangeU128 extends Struct {
  readonly min: u128;
  readonly ideal: u128;
  readonly max: u128;
}

export interface ParachainStakingInflationRangePerbill extends Struct {
  readonly min: Perbill;
  readonly ideal: Perbill;
  readonly max: Perbill;
}

export interface ParachainStakingParachainBondConfig extends Struct {
  readonly account: AccountId20;
  readonly percent: Percent;
}

export interface ParachainStakingRoundInfo extends Struct {
  readonly current: u32;
  readonly first: u32;
  readonly length: u32;
}

export type ParachainStakingSetOrderedSetBond = Vec<ParachainStakingBond>

export interface ParachainStakingDelegationRequest extends Struct {
  readonly collator: AccountId20;
  readonly amount: u128;
  readonly whenExecutable: u32;
  readonly action: ParachainStakingDelegationChange;
}

export interface ParachainStakingDelegationChange extends Enum {
  readonly isRevoke: boolean;
  readonly isDecrease: boolean;
  readonly type: 'Revoke' | 'Decrease';
}

export interface ParachainStakingDelegator extends Struct {
  readonly id: AccountId20;
  readonly delegations: ParachainStakingSetOrderedSetBond;
  readonly total: u128;
  readonly requests: ParachainStakingPendingDelegationRequests;
  readonly status: ParachainStakingDelegatorStatus;
}

export interface ParachainStakingPendingDelegationRequests extends Struct {
  readonly revocationsCount: u32;
  readonly requests: BTreeMap<AccountId20, ParachainStakingDelegationRequest>;
  readonly lessTotal: u128;
}

export interface ParachainStakingDelegatorStatus extends Enum {
  readonly isActive: boolean;
  readonly isLeaving: boolean;
  readonly asLeaving: u32;
  readonly type: 'Active' | 'Leaving';
}

export interface CandidateState extends ParachainStakingCandidateMetadata{
  readonly id: string;
  readonly topDelegations: Vec<ParachainStakingBond>;
  readonly bottomDelegations: Vec<ParachainStakingBond>;
  readonly totalBacking: BN;
}

export interface StakingInfo {
  collatorCommission: string|undefined;
  totalSelected?: number;
  totalSelectedStaked?: BN;
  totalCollatorCount?: number;
  selectedCollatorCount?: number;
  inflationPrct: string|undefined;
  parachainBondInfoPrct: string|undefined;
  activeDelegatorsCount: number;
  allDelegatorsCount: number;
}
