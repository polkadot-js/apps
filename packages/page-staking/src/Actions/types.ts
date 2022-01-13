// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, Balance, UnappliedSlashOther } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

export interface AmountValidateState {
  error: string | null;
  warning: string | null;
}

interface Unapplied {
  others: UnappliedSlashOther[];
  own: Balance;
  payout: Balance;
  reporters: AccountId[];
  validator: AccountId;
}

export interface Slash {
  era: BN;
  slashes: Unapplied[];
}

export type DestinationType = 'Staked' | 'Stash' | 'Controller' | 'Account';
