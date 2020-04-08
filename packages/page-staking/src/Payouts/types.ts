// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
