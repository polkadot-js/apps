// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance, EraIndex } from '@polkadot/types/interfaces';

export interface PayoutEra {
  era: EraIndex;
  stashes: Record<string, Balance>;
}

export interface PayoutValidator {
  eras: PayoutEra[];
  validatorId: string;
}
