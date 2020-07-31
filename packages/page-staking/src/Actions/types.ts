// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance, UnappliedSlashOther } from '@polkadot/types/interfaces';

import BN from 'bn.js';

export interface AmountValidateState {
  error: string | null;
  warning: string | null;
}

interface Unapplied {
  isValidator: boolean;
  others: UnappliedSlashOther[];
  own: Balance;
  payout: Balance;
  reporters: AccountId[];
  validator: AccountId;
}

export interface Slash {
  era: BN;
  isValidator: boolean;
  slashes: Unapplied[];
}
