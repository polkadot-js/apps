// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { UnappliedSlash } from '@polkadot/types/interfaces';

import BN from 'bn.js';

export interface Slash {
  era: BN;
  isMine: boolean;
  slash: UnappliedSlash;
  total: BN;
  totalOther: BN;
}

export interface SlashEra {
  era: BN;
  nominators: string[];
  payout: BN;
  reporters: string[];
  slashes: Slash[];
  validators: string[];
  total: BN;
}
