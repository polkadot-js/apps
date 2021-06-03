// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { DeriveStakerReward } from '@polkadot/api-derive/types';
import type { Balance, EraIndex } from '@polkadot/types/interfaces';

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
