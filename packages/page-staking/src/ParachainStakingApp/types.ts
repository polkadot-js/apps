// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {
  ParachainStakingCandidateMetadata,
  ParachainStakingBond
} from '@polkadot/types/lookup';
import type { Vec } from '@polkadot/types-codec';

import { BN } from '@polkadot/util';

export interface CandidateState extends ParachainStakingCandidateMetadata{
  readonly id: string;
  readonly topDelegations: Vec<ParachainStakingBond>;
  readonly bottomDelegations: Vec<ParachainStakingBond>;
  readonly totalBacking: BN;
}

export interface StakingInfo {
  collatorCommission: string|undefined;
  totalSelected: number;
  totalSelectedStaked: BN;
  totalCollatorCount: number;
  selectedCollatorCount: number;
  inflationPrct: string|undefined;
  parachainBondInfoPrct: string|undefined;
  activeDelegatorsCount: number;
  allDelegatorsCount: number;
}

export interface ActionRequest {
  collator: string;
  amount: string;
  whenExecutable: number;
  action: string;
}
