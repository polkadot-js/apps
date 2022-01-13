// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN } from '@polkadot/util';

export interface CollatorState {
  id: string;
  bond: string;
  delegators: string[]
  topDelegations: {amount: string, owner: Uint8Array}[]
  bottomDelegations: string[]
  totalCounted: string
  totalBacking: string
  state: string
}
export interface ApiResult{
  toHuman: () => string
}

export interface CollatorStateRaw {
  unwrap: () => CollatorState
}

export interface CollatorInfo{minDelegation: string, maxDelegatorsPerCandidate: string}

export interface OwnerAmount {owner: string, amount: BN}

export interface StakingInfo {
  collatorCommission: string|undefined,
  totalSelected: number,
  totalSelectedStaked: BN,
  totalCollatorCount: number,
  selectedCollatorCount: number,
  inflationPrct: string|undefined
  parachainBondInfoPrct: string|undefined
  activeDelegatorsCount: number
  allDelegatorsCount: number
}

export interface RoundInfo<T> {
  current: T;
  first: T;
  length: T;
}

export interface Delegation {
  collatorAddress: string;
  delegationAmount: string;
}
