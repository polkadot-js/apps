// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance } from '@polkadot/types/interfaces';

import BN from 'bn.js';

export interface ValidatorInfo {
  accountId: AccountId;
  bondOther: BN;
  bondOwn: Balance;
  bondShare: number;
  bondTotal: Balance;
  commission: Balance;
  isFavorite: boolean;
  isNominating: boolean;
  key: string;
  numNominators: number;
  rankBonded: number;
  rankCommission: number;
  rankOverall: number;
  rankReward: number;
  rewardPayout: BN;
  rewardSplit: BN;
}
