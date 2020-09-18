// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveStakerReward } from '@polkadot/api-derive/types';
import { Balance, EraIndex } from '@polkadot/types/interfaces';

import BN from 'bn.js';

export interface PayoutEraValidator {
  era: EraIndex;
  stashes: Record<string, Balance>;
}

export interface PayoutValidator {
  available: BN;
  eras: PayoutEraValidator[];
  validatorId: string;
}

export interface PayoutStash {
  available: BN;
  rewards: DeriveStakerReward[];
  stashId: string;
}
