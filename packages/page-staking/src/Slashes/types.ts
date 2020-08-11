// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { UnappliedSlash } from '@polkadot/types/interfaces';

import BN from 'bn.js';

export interface Slash {
  cumulative: BN;
  era: BN;
  slash: UnappliedSlash;
  total: BN;
  totalOther: BN;
}
