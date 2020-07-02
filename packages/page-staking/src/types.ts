// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance, BlockNumber, Hash, SessionIndex } from '@polkadot/types/interfaces';

import BN from 'bn.js';

export type Nominators = Record<string, string[]>;

export type AccountFilter = 'all' | 'controller' | 'session' | 'stash' | 'unbonded';

export type ValidatorFilter = 'all' | 'hasNominators' | 'noNominators' | 'hasWarnings' | 'noWarnings' | 'iNominated' | 'nextSet';

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
  rankComm: number;
  rankNumNominators: number;
  rankOverall: number;
  rankPayment: number;
  rankReward: number;
}

export interface ValidatorInfo extends ValidatorInfoRank {
  accountId: AccountId;
  bondOther: BN;
  bondOwn: Balance;
  bondShare: number;
  bondTotal: Balance;
  commissionPer: number;
  hasIdentity: boolean;
  isCommission: boolean;
  isElected: boolean;
  isFavorite: boolean;
  isNominating: boolean;
  key: string;
  numNominators: number;
  rewardPayout: BN;
  rewardSplit: BN;
  validatorPayment: BN;
}

export type TargetSortBy = keyof ValidatorInfoRank;

export interface SortedTargets {
  calcWith?: BN;
  lastReward?: BN;
  nominators?: string[];
  setCalcWith: (amount?: BN) => void;
  totalStaked?: BN;
  validators?: ValidatorInfo[];
}
