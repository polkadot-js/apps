// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Inflation } from '@polkadot/react-hooks/types';
import type { AccountId, Balance, BlockNumber, EraIndex, Exposure, Hash, SessionIndex, ValidatorPrefs, ValidatorPrefsTo196 } from '@polkadot/types/interfaces';

import BN from 'bn.js';

export type Nominators = Record<string, string[]>;

export type AccountFilter = 'all' | 'controller' | 'session' | 'stash' | 'unbonded';

export type ValidatorFilter = 'all' | 'hasNominators' | 'noNominators' | 'hasWarnings' | 'noWarnings' | 'iNominated' | 'nextSet';

export interface NominatedBy {
  index: number;
  nominatorId: string;
  submittedIn: EraIndex;
}

export interface Slash {
  accountId: AccountId;
  amount: Balance;
}

export interface SessionRewards {
  blockHash: Hash;
  blockNumber: BlockNumber;
  isEventsEmpty: boolean;
  parentHash: Hash;
  reward: Balance;
  sessionIndex: SessionIndex;
  slashes: Slash[];
  treasury: Balance;
}

interface ValidatorInfoRank {
  rankBondOther: number;
  rankBondOwn: number;
  rankBondTotal: number;
  rankNumNominators: number;
  rankOverall: number;
  rankReward: number;
}

export interface ValidatorInfo extends ValidatorInfoRank {
  accountId: AccountId;
  bondOther: BN;
  bondOwn: BN;
  bondShare: number;
  bondTotal: BN;
  commissionPer: number;
  exposure: Exposure;
  isActive: boolean;
  isBlocking: boolean;
  isElected: boolean;
  isFavorite: boolean;
  isNominating: boolean;
  key: string;
  knownLength: BN;
  lastPayout?: BN;
  minNominated: BN;
  numNominators: number;
  numRecentPayouts: number;
  skipRewards: boolean;
  stakedReturn: number;
  stakedReturnCmp: number;
  validatorPrefs?: ValidatorPrefs | ValidatorPrefsTo196;
  withReturns?: boolean;
}

export type TargetSortBy = keyof ValidatorInfoRank;

export interface SortedTargets {
  avgStaked?: BN;
  electedIds?: string[];
  inflation: Inflation;
  lowStaked?: BN;
  medianComm: number;
  minNominated: BN;
  nominators?: string[];
  nominateIds?: string[];
  totalStaked?: BN;
  totalIssuance?: BN;
  validators?: ValidatorInfo[];
  validatorIds?: string[];
  waitingIds?: string[];
}
